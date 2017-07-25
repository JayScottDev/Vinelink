import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { EmbeddedApp } from '@shopify/polaris/embedded';
import App from './App.js';

const el = document.getElementById('root');
const apiKey = '637b07d0402be00361d34e632d98be0f';
const shopOrigin = 'https://vine-link-dev.myshopify.com'; // TODO: should not be hard coded

render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey} forceRedirect>
        <App />
      </EmbeddedApp>
    </BrowserRouter>
  </Provider>,
  el
);
