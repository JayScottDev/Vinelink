import React, { Component } from 'react'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first: '',
      last: '',
      email: '',
      emailConfirm: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const target = e.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { first, last, email } = this.state
    console.log('submitting', first, last, email)
  }

  render() {
    return (
      <div className="profile">
        <h1>Profile Details</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="first">First name</label>
          <input
            type="text"
            name="first"
            value={this.state.first}
            placeholder="First name"
            onChange={this.handleChange} />
          <label htmlFor="last">Last name</label>
          <input
            type="text"
            name="last"
            value={this.state.last}
            placeholder="Last name"
            onChange={this.handleChange} />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={this.state.email}
            placeholder="Email"
            onChange={this.handleChange} />
          <label htmlFor="emailConfirm">Confirm email</label>
          <input
            type="text"
            name="emailConfirm"
            value={this.state.emailConfirm}
            placeholder="Confirm email"
            onChange={this.handleChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }

}

export default Profile
