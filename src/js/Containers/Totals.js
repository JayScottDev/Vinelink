import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchLogsTotal } from '../actions/';
import TileAggregate from '../Components/TileAggregate';
import { Layout } from '@shopify/polaris';

import '../../styles/totals.scss';

import totals from '../../data/totals';

class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliant: {},
      noncompliant: {}
    };
  }
  componentDidMount() {
    this.props.fetchLogsTotal('/compliance/logs/report/total');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.totals !== nextProps.totals;
  }

  render() {
    return (
      <section className="totals">
        <TileAggregate success data={totals.data} />
        <TileAggregate data={totals.data} />
      </section>
    );
  }
}

function mapStateToProps(state) {
  return { totals: state.total };
}

function mapDispatchToProps(dispatch) {
  return { fetchLogsTotal: bindActionCreators(fetchLogsTotal, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Totals);
