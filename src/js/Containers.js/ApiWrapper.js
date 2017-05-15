import React, { Component } from 'react'
import fetch from 'fetch'

function ApiWrapper (WrappedComponent) {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        data: {}
      }
    }

    componentDidMount () {
      fetch(this.props.endPoint)
      .then((response) => {
        console.log(response);
      })
    }

    render () {
      return (
        <WrappedComponent data={this.state.data} />
      )
    }
  }
}
