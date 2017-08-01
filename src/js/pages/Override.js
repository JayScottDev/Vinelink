import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@shopify/polaris';

class Override extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  componentDidMount () {}
  render () {
    return (
      <Card sectioned title="Override states">
        <h2>Caution!</h2>
        <p>
          These settings will automatically send order through regardless of
          compliance by state.
        </p>
        <h2>Override summary</h2>
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Complicancy status</th>
            </tr>
          </thead>
          <tbody />
        </table>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {};

export default connect(mapStateToProps, mapDispatchToProps)(Override);
