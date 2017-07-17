import React from 'react';
import { Card } from '@shopify/polaris';

const Override = props => {
  return (
    <Card sectioned title="Override states">
      <h2>Caution!</h2>
      <p>
        These settings will automatically send order through regardless of
        compliance by state.
      </p>
      <h2>Override summary</h2>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Complicancy status</th>
          </tr>
        </thead>
        <tbody />
      </table>
    </Card>
  );
};

export default Override;
