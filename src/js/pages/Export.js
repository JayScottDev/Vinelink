import React from 'react';
import Icon from '@shopify/polaris';
import Logs from '../Containers/Logs';

const Export = props => {
  return (
    <section className="export">
      <a href="/compliance/logs/export">Export Data</a>
      <Logs rowsPerPage={50} />
    </section>
  );
};

export default Export;
