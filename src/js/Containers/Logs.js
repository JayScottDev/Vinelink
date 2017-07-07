import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { fetchLogsLog } from '../actions/';
import { Card } from '@shopify/polaris';

import logs from '../../data/logs';

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliant: {},
      noncompliant: {}
    };

    this.formatDate = this.formatDate.bind(this);
  }
  componentDidMount() {
    this.props.fetchLogsLog('/compliance/logs');
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return this.props.logs !== nextProps.logs
  // }

  formatDate(date) {
    return moment(date).format('MMM DD [@] h:mm a');
  }

  render() {
    const { data } = logs;
    const rows =
      data &&
      data.map((row, i) => {
        const status = row.compliant ? 'compliant' : 'denied';
        return (
          <tr key={i}>
            <td>{status}</td>
            <td>{row.location_state}</td>
            <td>{row.cart_total}</td>
            <td>{row.tax_value || 'n/a'}</td>
            <td>{this.formatDate(row.checked_at)}</td>
          </tr>
        );
      });
    console.log('LOGS RENDER FUNCTION');
    console.log('ROWS', rows);
    return (
      <Card sectioned>
        {rows &&
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>State</th>
                <th>Total Cart Value</th>
                <th>Tax Addition</th>
                <th>Date & Time Stamp</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return { logs: state.log };
}

function mapDispatchToProps(dispatch) {
  return { fetchLogsLog: bindActionCreators(fetchLogsLog, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
