import React from 'react';
import { Page, Layout } from '@shopify/polaris';
import Totals from '../Containers/Totals';
import States from '../Containers/States';
import Graph from '../Containers/Graph';
import Logs from '../Containers/Logs';

const Home = props => {
  return (
    <Page title="Dashboard">
      <Layout>
        <Totals />
        <States />
        <Graph />
        <Logs />
      </Layout>
    </Page>
  );
};

export default Home;
