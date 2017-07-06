import React from 'react';
import { Page } from '@shopify/polaris';
import Totals from '../Containers/Totals';
import States from '../Containers/States';
import Graph from '../Containers/Graph';
import Logs from '../Containers/Logs';

const Home = props => {
  return (
    <Page title="Dashboard">
      <h2>Dashboard</h2>
      <Totals />
      <States />
      <Graph />
      <Logs />
    </Page>
  );
};

export default Home;
