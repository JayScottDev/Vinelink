import React, { Component } from 'react';
import { FormLayout, TextField, Checkbox, Card } from '@shopify/polaris';
import '../../styles/account.scss';

class Account extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
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
      <Card sectioned title="Account details">
        <h2>Change password</h2>
        <FormLayout>
          <TextField
            label="Current password"
            type="passord"
            name="currentPassword"
            value={this.state.currentPassword}
            placeholder="Current password"
            onChange={this.handleChange}
          />
          <TextField
            label="New password"
            type="password"
            name="newPassword"
            value={this.state.password}
            placeholder="New password"
            onChange={this.handleChange}
          />
          <TextField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            placeholder="Confirm password"
            onChange={this.handleChange}
          />
          <button className="btn btn--submit">Update password</button>
        </FormLayout>

        <section className="account__delete">
          <h2>Delete account</h2>
          <p>
            USE WITH CAUTION. Delete your accdount and all of your data. You
            will not be able to undo this action
          </p>
          <Checkbox
            label="I understand that by deleting my account I will lose all my data and
          settings"
            name="confirmDelete"
          />
          <button className="btn btn--delete">Delete my account</button>
        </section>
      </Card>
    );
  }
}

export default Account;
