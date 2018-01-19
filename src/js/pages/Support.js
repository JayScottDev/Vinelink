import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Support extends Component {
  constructor (props) {
    super(props)
    this.state = {
      first: '',
      last: '',
      email: '',
      question: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    const target = e.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { first, last, email } = this.state
    console.log('submitting', first, last, email)
  }

  render () {
    return (
      <div className="support">
        <h1>Support details</h1>
        <h2>Need some help?</h2>
        <p>Start with our <Link to='/settings/faq'>FAQ</Link>. Most, if not all, commonly asked question should be addressed there.</p>

        <h2>Contact us. We usually respond within 24 &ndash; 48 hours.</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="first"
            value={this.state.first}
            placeholder="First name"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="last"
            value={this.state.last}
            placeholder="Last name"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="email"
            value={this.state.email}
            placeholder="Email"
            onChange={this.handleChange}
          />
          <textarea
            value={this.state.question}
            name="question"
            placeholder="Enter your question here."
            onChange={this.handleChange}
          />
          <button>Submit</button>
        </form>

      </div>
    )
  }

}

export default Support
