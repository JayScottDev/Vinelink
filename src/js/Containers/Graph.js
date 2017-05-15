import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchLogsDate } from '../actions/'

class Graph extends Component {
  constructor (props) {
    super(props)
    this.state = {
      compliant: {},
      noncompliant: {}
    }
  }
  componentDidMount () {
    this.props.fetchDateLog('/compliance/logs/report/date')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.dates.data !== nextProps.dates.data
  }

  render () {
    console.log(this.props.logs);


    return (
      <div className="logs">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>State</th>
            <th>Total Cart Value</th>
            <th>Tax Addition</th>
            <th>Date &amp; Time Stamp</th>
          </tr>
        </thead>

      </table>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { dates: state.date }
}

function mapDispatchToProps (dispatch) {
  return { fetchLogsDate: bindActionCreators(fetchLogsDate, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
