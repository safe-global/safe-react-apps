import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@gnosis.pm/safe-react-components';
import { SafeProvider } from '@gnosis.pm/safe-apps-react-sdk';

import * as serviceWorker from './serviceWorker';

import Dashboard from './components/Dashboard';
import GlobalStyles from './global';

ReactDOM.render(
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <SafeProvider>
        <Dashboard />
      </SafeProvider>
    </ThemeProvider>
  </>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
