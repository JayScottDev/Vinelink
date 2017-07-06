import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchLogsState } from '../actions/';
import TileDetail from '../Components/TileDetail';
import { Layout } from '@shopify/polaris';

class States extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliant: {},
      noncompliant: {}
    };
  }
  componentDidMount() {
    this.props.fetchLogsState('/compliance/logs/report/state');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.states.data !== nextProps.states.data;
  }

  render() {
    const { data } = this.props.states;
    const compliantStates =
      data &&
      data.filter(state => {
        return (
          parseInt(state.compliant_count) && !parseInt(state.noncompliant_count)
        );
      });

    const nonCompliantStates =
      data &&
      data.filter(state => {
        return (
          !parseInt(state.compliant_count) && parseInt(state.noncompliant_count)
        );
      });
    return (
      <Layout>
        <Layout.Section>
          <TileDetail success data={compliantStates} />
        </Layout.Section>
        <Layout.Section>
          <TileDetail data={nonCompliantStates} />
        </Layout.Section>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return { states: state.state };
}

function mapDispatchToProps(dispatch) {
  return { fetchLogsState: bindActionCreators(fetchLogsState, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(States);
