/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import { render as renderReactApp } from 'react-dom';
import App from './App';
import { AppProviders } from './AppProviders';
import { initStore } from './store/store';

const render = () => {
  return renderReactApp(
    <AppProviders store={initStore()}>
      <App />
    </AppProviders>,
    document.getElementById('root'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
