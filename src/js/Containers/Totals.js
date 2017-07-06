import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchLogsTotal } from '../actions/';
import TileAggregate from '../Components/TileAggregate';
import { Layout } from '@shopify/polaris';

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
      <Layout sectioned>
        <Layout.Section>
          <TileAggregate success data={this.props.totals.data} />
        </Layout.Section>
        <Layout.Section>
          <TileAggregate data={this.props.totals.data} />
        </Layout.Section>
      </Layout>
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
