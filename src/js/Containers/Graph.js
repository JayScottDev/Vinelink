import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { VictoryLabel, VictoryAxis, VictoryLine } from 'victory';
import { fetchLogsDate } from '../actions/';
import { Card } from '@shopify/polaris';
import { Layout } from '@shopify/polaris';

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
            <svg style={styles.parent} viewBox="0 0 450 350">
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
                  tickFormat={x => {
                    if (x.getFullYear() === 2000) {
                      return x.getFullYear();
                    }
                    if (x.getFullYear() % 5 === 0) {
                      return x.getFullYear().toString().slice(2);
                    }
                  }}
                />

                {/*
           Add the dependent axis for the first data set.
           Note that all components plotted against this axis will have the same y domain
         */}
                <VictoryAxis
                  dependentAxis
                  domain={[-10, 15]}
                  offsetX={50}
                  orientation="left"
                  standalone={false}
                  style={styles.axisOne}
                />

                {/* dataset one */}
                <VictoryLine
                  data={dataSetOne}
                  domain={{
                    x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
                    y: [-10, 15]
                  }}
                  interpolation="monotoneX"
                  scale={{ x: 'time', y: 'linear' }}
                  standalone={false}
                  style={styles.lineOne}
                />

                {/*
           Add the dependent axis for the second data set.
           Note that all components plotted against this axis will have the same y domain
         */}

                {/* dataset two */}
                <VictoryLine
                  data={dataSetTwo}
                  domain={{
                    x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
                    y: [0, 50]
                  }}
                  interpolation="monotoneX"
                  scale={{ x: 'time', y: 'linear' }}
                  standalone={false}
                  style={styles.lineTwo}
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
    { x: new Date(2000, 1, 1), y: 12 },
    { x: new Date(2000, 6, 1), y: 10 },
    { x: new Date(2000, 12, 1), y: 11 },
    { x: new Date(2001, 1, 1), y: 5 },
    { x: new Date(2002, 1, 1), y: 4 },
    { x: new Date(2003, 1, 1), y: 6 },
    { x: new Date(2004, 1, 1), y: 5 },
    { x: new Date(2005, 1, 1), y: 7 },
    { x: new Date(2006, 1, 1), y: 8 },
    { x: new Date(2007, 1, 1), y: 9 },
    { x: new Date(2008, 1, 1), y: -8.5 },
    { x: new Date(2009, 1, 1), y: -9 },
    { x: new Date(2010, 1, 1), y: 5 },
    { x: new Date(2013, 1, 1), y: 1 },
    { x: new Date(2014, 1, 1), y: 2 },
    { x: new Date(2015, 1, 1), y: -5 }
  ];
};

const getDataSetTwo = () => {
  return [
    { x: new Date(2000, 1, 1), y: 5 },
    { x: new Date(2003, 1, 1), y: 6 },
    { x: new Date(2004, 1, 1), y: 4 },
    { x: new Date(2005, 1, 1), y: 10 },
    { x: new Date(2006, 1, 1), y: 12 },
    { x: new Date(2007, 2, 1), y: 48 },
    { x: new Date(2008, 1, 1), y: 19 },
    { x: new Date(2009, 1, 1), y: 31 },
    { x: new Date(2011, 1, 1), y: 49 },
    { x: new Date(2014, 1, 1), y: 40 },
    { x: new Date(2015, 1, 1), y: 21 }
  ];
};

const getTickValues = () => {
  return [
    new Date(1999, 1, 1),
    new Date(2000, 1, 1),
    new Date(2001, 1, 1),
    new Date(2002, 1, 1),
    new Date(2003, 1, 1),
    new Date(2004, 1, 1),
    new Date(2005, 1, 1),
    new Date(2006, 1, 1),
    new Date(2007, 1, 1),
    new Date(2008, 1, 1),
    new Date(2009, 1, 1),
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    new Date(2012, 1, 1),
    new Date(2013, 1, 1),
    new Date(2014, 1, 1),
    new Date(2015, 1, 1),
    new Date(2016, 1, 1)
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
      fill: '#000000',
      fontFamily: 'inherit',
      fontSize: '18px',
      fontWeight: 'bold'
    },

    // INDEPENDENT AXIS
    axisYears: {
      axis: { stroke: GRAY_COLOR, strokeWidth: 1 },
      ticks: {
        size: tick => {
          const tickSize = tick.getFullYear() % 2 === 0 ? 10 : 5;
          return tickSize;
        },
        stroke: GRAY_COLOR,
        strokeWidth: 1
      },
      tickLabels: {
        fill: TEXT_COLOR,
        fontFamily: 'inherit',
        fontSize: 10
      }
    },

    // DATA SET ONE
    axisOne: {
      grid: {
        stroke: tick => (tick === -10 ? 'transparent' : GRAY_COLOR),
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
      fontSize: 14,
      fontWeight: 500
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
