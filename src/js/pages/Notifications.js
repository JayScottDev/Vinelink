import React from 'react';
import { Card } from '@shopify/polaris';

const Notifications = props => {
  return (
    <Card sectioned title="Notifications">
      <h2>Notification settings</h2>
      <p>You are currently subscribed to all notifications</p>
      <button>Unsubscribe from all emails</button>
    </Card>
  );
};

export default Notifications;
