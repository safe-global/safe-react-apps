import React from 'react';
import ReactDOM from 'react-dom';
import { SafeProvider } from '@gnosis.pm/safe-apps-react-sdk';

import GlobalStyles from './global';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { Loader, theme, Title } from '@gnosis.pm/safe-react-components';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <SafeProvider
        loader={
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
      >
        <App />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
