import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { SafeProvider } from '@gnosis.pm/safe-apps-react-sdk';

import GlobalStyles from './global';
import * as serviceWorker from './serviceWorker';
import App from './App';
import getTheme from './customTheme';

const theme = getTheme();

ReactDOM.render(
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <SafeProvider>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
