import React from 'react';
import { Card, FormLayout, TextField } from '@shopify/polaris';

const Integrations = props => {
  return (
    <Card sectioned Title="Integrations">
      <h2>Ship Compliant</h2>
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
    </Card>
  );
};

export default Integrations;
