import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchLogsLog } from '../actions/'
import TileDetail from '../Components/TileDetail'

class Logs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      compliant: {},
      noncompliant: {}
    }
  }
  componentDidMount () {
    this.props.fetchLogsLog('/compliance/logs')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.props.logs.data !== nextProps.logs.data
  }

  render () {
    console.log(this.props.logs);

    const { data } = this.props.logs

    const rows = data && data.map(row => {
      const status = row.compliant ? 'compliant' : 'denied'
      return (
        <tr>
          <td>{status}</td>
          <td>{row.location_state}</td>
          <td>{row.cart_total}</td>
          <td>{row.tax_value || 'n/a'}</td>
          <td>{row.checked_at}</td>
        </tr>
      )
    })

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
        <tbody>{rows}</tbody>
      </table>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { logs: state.log }
}

function mapDispatchToProps (dispatch) {
  return { fetchLogsLog: bindActionCreators(fetchLogsLog, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs)
