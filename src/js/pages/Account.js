import React, { Component } from 'react'

class Account extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
      <div className="account">
        <h1>Account details</h1>
        <h2>Current account status</h2>
        <p>You are currently on the Free Plan</p>
        <button>Upgrade account</button>
        <h2>Change password</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="currentPassword">Current password</label>
          <input
            type="password"
            name="currentPassword"
            value={this.state.currentPassword}
            placeholder="Current password"
            onChange={this.handleChange}
          />
          <label htmlFor="newPassword">New password</label>
          <input
            type="password"
            name="newPassword"
            value={this.state.newPassword}
            placeholder="New password"
            onChange={this.handleChange}
            />
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
          type="password"
          name="confirmPassword"
          value={this.state.confirmPassword}
          placeholder="Confirm password"
          onChange={this.handleChange}
          />
        </form>
        <h2>Delete account</h2>
        <p>USE WITH CAUTION. Delete your accdount and all of your data. You will not be able to undo this action</p>
        <p>I understand that by deleting my account I will lose all my data and settings</p>
        <input type="checkbox" name="confirmDelete" />
        <button>Delete my account</button>
      </div>
    )
  }
}

export default Account
