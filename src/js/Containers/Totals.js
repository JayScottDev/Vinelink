import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchLogsTotal } from '../actions/'
import TileAggregate from '../Components/TileAggregate'

class Totals extends Component {
  constructor (props) {
    super(props)
    this.state = {
      compliant: {},
      noncompliant: {}
    }
  }
  componentDidMount () {
    console.log('PROPS', this.props);
    this.props.fetchLogsTotal('/compliance/logs/report/total')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.totals !== nextProps.totals
  }

  render () {
    console.log('rendering', this.props);
    return (
      <div className="totals">
        <TileAggregate success data={this.props.totals.data} />
        <TileAggregate data={this.props.totals.data} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { totals: state.total }
}

function mapDispatchToProps (dispatch) {
  return { fetchLogsTotal: bindActionCreators(fetchLogsTotal, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Totals)
