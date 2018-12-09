const keys = require("./config/keys");
const Agent = require("./connectToDb");

// Will clean DB and insert agents demo data into db.
const DemoDate = require("./insertDemoData");

const app = require("express")();
const bodyParser = require("body-parser");
const geolib = require("geolib");
const googleMapsClient = require("@google/maps").createClient({
  key: keys.GOOGLE_MAP_API_KEY,
  Promise: Promise
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/countries-by-isolation", (req, res) =>
  Agent.find().then(agents => {
    const isolatedCountry = calculateIsolatedAgents(agents);
    res.json({ isolatedCountry, agents });
  })
);

app.post("/api/find-closet", async (req, res) => {
  const { missionsCord, allMissionsData } = await createMissionsCords();

  const {
    short,
    long,
    all,
    addressFromBrowser,
    errorLocation
  } = await checkDistance(req, missionsCord, allMissionsData);

  res.json({
    short,
    long,
    all,
    addressFromBrowser,
    errorLocation
  });
});

app.listen(keys.WEB_DEV_PORT, () =>
  console.log(`Express listening on port ${keys.WEB_DEV_PORT}`)
);

checkDistance = async (req, missionsCord, allMissionsData) => {
  const targetLocation = "target-location";
  let addressFromBrowser = "";
  try {
    if (JSON.parse(req.body[targetLocation]).join(" ")) {
      addressFromBrowser = JSON.parse(req.body[targetLocation]).join(" ");
    }
  } catch (e) {
    addressFromBrowser = req.body[targetLocation];
  }

  const response = await googleMapsClient
    .geocode({
      address: addressFromBrowser
    })
    .asPromise();

  let shortestDistance = null,
    longestDistance = null,
    errorLocation = null;

  for (let missionCord in missionsCord) {
    try {
      let distance = geolib.getDistance(
        response.json.results[0].geometry.location,
        missionsCord[missionCord].cord
      );
      if (shortestDistance) {
        if (shortestDistance.distance > distance) {
          shortestDistance = { ...missionsCord[missionCord], distance };
        }
      } else {
        shortestDistance = { ...missionsCord[missionCord], distance };
      }

      if (longestDistance) {
        if (longestDistance.distance < distance) {
          longestDistance = { ...missionsCord[missionCord], distance };
        }
      } else {
        longestDistance = { ...missionsCord[missionCord], distance };
      }
    } catch (e) {
      errorLocation = "Cant find location";
    }
  }

  return {
    short: { ...shortestDistance },
    long: { ...longestDistance },
    all: { ...allMissionsData },
    addressFromBrowser,
    errorLocation
  };
};

createMissionsCords = async () => {
  const missionsCord = [];
  const allMissionsData = await Agent.find();
  for (let mission in allMissionsData) {
    let response = await googleMapsClient
      .geocode({
        address: allMissionsData[mission].address
      })
      .asPromise();

    missionsCord.push({
      _id: allMissionsData[mission]._id,
      cord: response.json.results[0].geometry.location
    });
  }
  return { missionsCord, allMissionsData };
};

calculateIsolatedAgents = agents => {
  let isolatedAgents = {};

  for (let i = 0; i < agents.length; i++) {
    let agentId = agents[i].agent;
    let countriesToArray = [agents[i].country];

    if (isolatedAgents[agentId]) {
      countriesToArray = [
        ...isolatedAgents[agentId].countries,
        agents[i].country
      ];
    }

    isolatedAgents = {
      ...isolatedAgents,
      [agentId]: {
        countries: [...countriesToArray],
        length: countriesToArray.length
      }
    };
  }
  return calculateIsolatedCountries(isolatedAgents);
};

calculateIsolatedCountries = isolatedAgents => {
  let countriesArray = {};

  for (let agent in isolatedAgents) {
    if (isolatedAgents[agent].length === 1) {
      let countryName = isolatedAgents[agent].countries[0];

      countriesArray[countryName] = (countriesArray[countryName] || 0) + 1;
    }
  }
  let mostIsolatedCountry = {};

  for (let country in countriesArray) {
    if (countriesArray[country] > (mostIsolatedCountry.isolationDegree || 0)) {
      mostIsolatedCountry = {
        country,
        isolationDegree: countriesArray[country]
      };
    }
  }
  return mostIsolatedCountry;
};
