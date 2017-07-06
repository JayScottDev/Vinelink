import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { VictoryChart, VictoryStack, VictoryLine } from 'victory';
import { fetchLogsDate } from '../actions/';
import { Card } from '@shopify/polaris';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliant: [],
      noncompliant: []
    };
  }
  componentDidMount() {
    this.props.fetchLogsDate('/compliance/logs/report/date');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.dates.data !== nextProps.dates.data;
  }

  render() {
    const { data } = this.props.dates;
    const compliant =
      data &&
      data.map(date => {
        return { date: date.checked_day, count: date.compliant_count };
      });
    const noncompliant =
      data &&
      data.map(date => {
        return { date: date.checked_day, count: date.noncompliant_count };
      });
    return (
      <Card sectioned>
        {compliant &&
          noncompliant &&
          <VictoryChart>
            <VictoryStack>
              <VictoryLine name="line-1" data={compliant} x="date" y="count" />
              <VictoryLine
                name="line-2"
                data={noncompliant}
                x="date"
                y="count"
              />
            </VictoryStack>
          </VictoryChart>}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return { dates: state.date };
}

function mapDispatchToProps(dispatch) {
  return { fetchLogsDate: bindActionCreators(fetchLogsDate, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
