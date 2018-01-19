import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchLogsDate } from '../actions/'
import TileDetail from '../Components/TileDetail'

class Dates extends Component {
  constructor (props) {
    super(props)
    this.state = {
      compliant: {},
      noncompliant: {}
    }
  }
  componentDidMount () {
    this.props.fetchLogsDate('/compliance/logs/report/date')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.dates.data !== nextProps.dates.data
  }

  render () {
    console.log(this.props.dates);

    const { data } = this.props.dates

    const rows = data && data.map(row => {
      return (
        <tr>
          <td></td>
        </tr>
      )
    })

    return (
      <div className="date">
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
        <tbody></tbody>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dates)
