import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@gnosis.pm/safe-react-components';
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk';

import App from './App';
import RampLoader from './components/RampLoader';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SafeProvider loader={<RampLoader />}>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
