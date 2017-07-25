import React, { Component } from 'react';
import { FormLayout, TextField, Card } from '@shopify/polaris';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      email: '',
      emailConfirm: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    const { first, last, email } = this.state;
    console.log('submitting', first, last, email);
  }

  render () {
    return (
      <Card title="Profile Details" sectioned>
        <FormLayout>
          <TextField
            label="First name"
            name="first"
            value={this.state.first}
            placeholder="First name"
            onChange={this.handleChange}
          />
          <TextField
            label="Last name"
            name="last"
            value={this.state.last}
            placeholder="Last name"
            onChange={this.handleChange}
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={this.state.email}
            placeholder="Email"
            onChange={this.handleChange}
          />
          <TextField
            label="Confirm email"
            type="email"
            name="emailConfirm"
            value={this.state.emailConfirm}
            placeholder="Confirm email"
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </FormLayout>
      </Card>
    );
  }
}

export default Profile;
