import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { Page } from '@shopify/polaris';
import Main from './pages/Main';

import '@shopify/polaris/styles.css';

import '../styles/app.scss';

const App = props => {
  const contextTypes = {
    easdk: PropTypes.object
  };
  return (
    <Page title="Vinelink">
      <Main />
    </Page>
  );
};

export default App;
