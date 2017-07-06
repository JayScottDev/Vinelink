import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { Page } from '@shopify/polaris';
import Dashboard from './pages/Dashboard';
import Install from './pages/Install';
import Settings from './pages/Settings';
import Export from './pages/Export';
import Profile from './pages/Profile';

import Nav from './site/Nav';

class App extends Component {
  static contextTypes = {
    easdk: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      confirmed: false
    };
  }
  render() {
    return (
      <Page>
        <Nav />
        <section className="app__container">
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/settings" component={Settings} />
          <Route path="/export" component={Export} />
          <Route path="/install" component={Install} />
        </section>
      </Page>
    );
  }
}

export default App;
