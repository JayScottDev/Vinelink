import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { VictoryLabel, VictoryAxis, VictoryLine } from 'victory';
import { fetchLogsDate } from '../actions/';
import { Layout, Card } from '@shopify/polaris';

import dates from '../../data/dates';

class Graph extends Component {
  constructor (props) {
    super(props);
    this.state = {
      compliant: [],
      noncompliant: []
    };
  }
  componentDidMount () {
    this.props.fetchLogsDate('/compliance/logs/report/date');
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.dates.data !== nextProps.dates.data;
  }

  render () {
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

    const styles = getStyles();
    const dataSetOne = getDataSetOne();
    const dataSetTwo = getDataSetTwo();
    const tickValues = getTickValues();
    return (
      <Layout.Section>
        <Card sectioned>
          {compliant &&
            noncompliant &&
            <svg style={styles.parent} viewBox="0 0 450 310">
              {/* Define labels */}
              <VictoryLabel
                x={25}
                y={24}
                style={styles.title}
                text="Zip Checks over time"
              />

              <VictoryLabel
                x={25}
                y={55}
                style={styles.labelOne}
                text={'Zip checks'}
              />

              <g transform={'translate(0, 40)'}>
                {/* Add shared independent axis */}
                <VictoryAxis
                  scale="time"
                  standalone={false}
                  style={styles.axisYears}
                  tickValues={tickValues}
                />

                {/*
           Add the dependent axis for the first data set.
           Note that all components plotted against this axis will have the same y domain
         */}
                <VictoryAxis
                  dependentAxis
                  domain={[0, 100]}
                  offsetX={50}
                  orientation="left"
                  standalone={false}
                  style={styles.axisOne}
                />

                {/* dataset one */}
                <VictoryLine
                  data={dataSetOne}
                  domain={{
                    x: [new Date(2017, 4, 1), new Date(2017, 7, 31)],
                    y: [0, 100]
                  }}
                  interpolation="linear"
                  scale={{ x: 'time', y: 'linear' }}
                  standalone={false}
                  style={styles.lineOne}
                  animate={{
                    duration: 3000,
                    onLoad: { duration: 2000 }
                  }}
                />

                {/*
           Add the dependent axis for the second data set.
           Note that all components plotted against this axis will have the same y domain
         */}

                {/* dataset two */}
                <VictoryLine
                  data={dataSetTwo}
                  domain={{
                    x: [new Date(2017, 4, 1), new Date(2017, 7, 31)],
                    y: [0, 100]
                  }}
                  interpolation="linear"
                  scale={{ x: 'time', y: 'linear' }}
                  standalone={false}
                  style={styles.lineTwo}
                  animate={{
                    duration: 3000,
                    onLoad: { duration: 2000 }
                  }}
                />
              </g>
            </svg>}
        </Card>
      </Layout.Section>
    );
  }
}

const getDataSetOne = () => {
  return [
    { x: new Date(2017, 4, 2), y: 32 },
    { x: new Date(2017, 4, 20), y: 20 },
    { x: new Date(2017, 5, 18), y: 12 },
    { x: new Date(2017, 5, 21), y: 42 },
    { x: new Date(2017, 5, 30), y: 26 },
    { x: new Date(2017, 6, 4), y: 33 },
    { x: new Date(2017, 6, 12), y: 48 },
    { x: new Date(2017, 6, 27), y: 51 },
    { x: new Date(2017, 7, 4), y: 33 },
    { x: new Date(2017, 7, 13), y: 56 }
  ];
};

const getDataSetTwo = () => {
  return [
    { x: new Date(2017, 4, 2), y: 12 },
    { x: new Date(2017, 4, 20), y: 21 },
    { x: new Date(2017, 5, 18), y: 17 },
    { x: new Date(2017, 5, 21), y: 32 },
    { x: new Date(2017, 5, 30), y: 15 },
    { x: new Date(2017, 6, 4), y: 11 },
    { x: new Date(2017, 6, 12), y: 37 },
    { x: new Date(2017, 6, 27), y: 32 },
    { x: new Date(2017, 7, 4), y: 15 },
    { x: new Date(2017, 7, 13), y: 39 }
  ];
};

const getTickValues = () => {
  return [
    new Date(2017, 4, 1),
    new Date(2017, 4, 15),
    new Date(2017, 5, 1),
    new Date(2017, 5, 15),
    new Date(2017, 6, 1),
    new Date(2017, 6, 15),
    new Date(2017, 7, 1),
    new Date(2017, 7, 15)
  ];
};

const getStyles = () => {
  const PURPLE_COLOR = '#9C6ADE';
  const TEAL_COLOR = '#47C1BF';
  const GRAY_COLOR = '#DFE4E8';
  const TEXT_COLOR = '#637381';
  const HEADER_COLOR = '#212B35';

  return {
    parent: {
      background: '#FFF',
      boxSizing: 'border-box',
      display: 'inline',
      padding: 0,
      margin: 20,
      fontFamily:
        "'-apple-system','BlinkMacSystemFont','San Francisco','Roboto','Segoe UI','Helvetica Neue',sans-serif;",
      width: '100%',
      height: 'auto'
    },
    title: {
      textAnchor: 'start',
      verticalAnchor: 'end',
      fill: '#212b36',
      fontFamily: 'inherit',
      fontSize: 14
      // fontWeight: 'bold'
    },

    // INDEPENDENT AXIS
    axisYears: {
      axis: { stroke: GRAY_COLOR, strokeWidth: 1 },
      ticks: {
        stroke: GRAY_COLOR,
        strokeWidth: 1
      },
      tickLabels: {
        fill: TEXT_COLOR,
        fontFamily: 'inherit',
        fontSize: 8
      }
    },

    // DATA SET ONE
    axisOne: {
      grid: {
        stroke: GRAY_COLOR,
        strokeWidth: 1
      },
      axis: { stroke: GRAY_COLOR, strokeWidth: 0 },
      ticks: { strokeWidth: 0 },
      tickLabels: {
        fill: TEXT_COLOR,
        fontFamily: 'inherit',
        fontSize: 10
      }
    },
    labelOne: {
      fill: HEADER_COLOR,
      fontFamily: 'inherit',
      fontSize: 10
    },
    lineOne: {
      data: { stroke: PURPLE_COLOR, strokeWidth: 1.5 }
    },

    // DATA SET TWO
    lineTwo: {
      data: { stroke: TEAL_COLOR, strokeWidth: 1.5 }
    }
  };
};

function mapStateToProps (state) {
  return { dates: state.date };
}

function mapDispatchToProps (dispatch) {
  return { fetchLogsDate: bindActionCreators(fetchLogsDate, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
