import React, { Component } from "react";
import { Table, Button } from "reactstrap";

class findCloset extends Component {
  state = { loading: true, inputAddress: "" };

  componentDidMount() {
    fetch("/find-closet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "target-location": this.state.inputAddress || "[tel-aviv israel]"
      })
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ ...this.state, ...data, loading: false });
        console.log(this.state.errorLocation);
      })
      .catch(error => console.log(error));
  }
  render() {
    let rows = [];
    if (this.state.all) {
      for (let mission in this.state.all) {
        let isStyle = {};

        // eslint-disable-next-line no-unused-expressions
        this.state.short._id === this.state.all[mission]._id
          ? (isStyle = { color: "green" })
          : {};

        // eslint-disable-next-line no-unused-expressions
        this.state.long._id === this.state.all[mission]._id
          ? (isStyle = { color: "red" })
          : null;

        rows.push(
          <tr key={this.state.all[mission]._id}>
            <th scope="row" style={isStyle}>
              {this.state.all[mission].agent}
            </th>
            <td style={isStyle}>{this.state.all[mission].country}</td>
            <td style={isStyle}>{this.state.all[mission].address}</td>
            <td style={isStyle}>{this.state.all[mission].date}</td>
          </tr>
        );
      }
    }
    return (
      <div>
        <h1>Find Closet</h1>
        {this.state.addressFromBrowser ? (
          <div>
            <h2>
              Address used:{" "}
              {this.state.errorLocation
                ? this.state.errorLocation
                : this.state.addressFromBrowser}
            </h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                this.setState({ ...this.state, loading: true });
                this.componentDidMount();
              }}
            >
              <input
                value={this.state.inputAddress}
                placeholder="Enter new address"
                onChange={e =>
                  this.setState({
                    ...this.state,
                    inputAddress: e.target.value
                  })
                }
              />
              <Button>Send</Button>
            </form>
          </div>
        ) : null}
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
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
        )}
      </div>
    );
  }
}

export default findCloset;
