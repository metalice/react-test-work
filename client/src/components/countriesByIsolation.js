import React, { Component } from "react";
import { Table } from "reactstrap";

class countriesByIsolation extends Component {
  state = { loading: true };

  componentDidMount() {
    fetch("/countries-by-isolation")
      .then(res => res.json())
      .then(data =>
        this.setState({
          ...this.state,
          country: data.isolatedCountry.country,
          isolationDegree: data.isolatedCountry.isolationDegree,
          agents: data.agents,
          loading: false
        })
      )
      .catch(error => console.log(error));
  }
  render() {
    let rows = [];
    let isStyle = {};
    if (this.state.agents) {
      for (let mission in this.state.agents) {
        // eslint-disable-next-line no-unused-expressions
        this.state.country === this.state.agents[mission].country
          ? (isStyle = { color: "green" })
          : (isStyle = {});

        rows.push(
          <tr key={this.state.agents[mission]._id}>
            <th scope="row">{this.state.agents[mission].agent}</th>
            <td style={isStyle}>{this.state.agents[mission].country}</td>
            <td>{this.state.agents[mission].address}</td>
            <td>{this.state.agents[mission].date}</td>
          </tr>
        );
      }
    }
    return (
      <div>
        <h1>Countries By Isolations</h1>
        {!this.state.loading ? (
          <h2 style={isStyle}>
            The most isolated country is {this.state.country} with isolation
            degree of {this.state.isolationDegree}
          </h2>
        ) : null}
        <Table hover responsive>
          <thead>
            <tr>
              <th>Agent Id</th>
              <th>Country</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {this.state.loading ? <p>Loading...</p> : null}
      </div>
    );
  }
}

export default countriesByIsolation;
