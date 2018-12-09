const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose
  .connect(
    `mongodb://${keys.DB_DEV_USER}:${keys.DB_DEV_PASS}@${keys.DB_DEV_HOST}:${
      keys.DB_DEV_PORT
    }/${keys.DB_DEV_DBNAME}`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(error => {
    console.log(error);
  });
const schema = new mongoose.Schema({
  agent: "string",
  country: "string",
  address: "string",
  date: "String"
});

const Agent = mongoose.model("Agent", schema);

module.exports = Agent;
