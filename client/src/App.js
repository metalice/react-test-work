import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import countriesByIsolation from "./components/countriesByIsolation";
import findCloset from "./components/findCloset";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/countries-by-isolation"
            component={countriesByIsolation}
          />
          <Route exact path="/find-closet" component={findCloset} />
        </div>
      </Router>
    );
  }
}

export default App;
