import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { EmbeddedApp } from '@shopify/polaris/embedded';
import App from './App.js';

const el = document.getElementById('root');
const apiKey = 'cc4a45f80b5b09aa143cab3065972dd1';
const shopOrigin = 'https://vine-link-dev.myshopify.com'; // TODO: should not be hard coded

render(
  <Provider store={store}>
    <BrowserRouter basename="/compliancy-connector">
      <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey} forceRedirect>
        <App />
      </EmbeddedApp>
    </BrowserRouter>
  </Provider>,
  el
);
