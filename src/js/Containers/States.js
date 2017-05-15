import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchLogsState } from '../actions/'
import TileDetail from '../Components/TileDetail'

class States extends Component {
  constructor (props) {
    super(props)
    this.state = {
      compliant: {},
      noncompliant: {}
    }
  }
  componentDidMount () {
    console.log('PROPS', this.props);
    this.props.fetchLogsState('/compliance/logs/report/state')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.states.data !== nextProps.states.data
  }

  render () {
    console.log(this.props.states);

    const { data } = this.props.states
    const compliantStates = data && data.filter(state => {
      return parseInt(state.compliant_count) && !parseInt(state.noncompliant_count)
    })

    const nonCompliantStates = data && data.filter(state => {
      return !parseInt(state.compliant_count) && parseInt(state.noncompliant_count)
    })


    console.log('compliant states', compliantStates);
    console.log('non compliant states', nonCompliantStates);

    console.log('RENDING STATES COMPONENT');
    return (
      <div className="totals">
        <TileDetail success data={compliantStates} />
        <TileDetail data={nonCompliantStates} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { states: state.state }
}

function mapDispatchToProps (dispatch) {
  return { fetchLogsState: bindActionCreators(fetchLogsState, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(States)
