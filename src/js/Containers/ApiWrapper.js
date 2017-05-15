import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'

function ApiWrapper (WrappedComponent) {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        data: {}
      }
    }

    componentDidMount () {
      fetch('/compliance/logs/report/total')
      .then((response) => {
        console.log(response);
      })
    }

    render () {
      return (
        <WrappedComponent data={this.state.data} {...this.props} />
      )
    }
  }
}

export default ApiWrapper
