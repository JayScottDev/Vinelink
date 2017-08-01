import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { store } from './store/store';
import { EmbeddedApp } from '@shopify/polaris/embedded';

import App from './App.js';

const el = document.getElementById('root');
const apiKey = '637b07d0402be00361d34e632d98be0f';
const shopOrigin = 'https://vine-link-dev.myshopify.com'; // TODO: should not be hard coded
const history = createHistory();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey} forceRedirect>
        <App />
      </EmbeddedApp>
    </ConnectedRouter>
  </Provider>,
  el
);
