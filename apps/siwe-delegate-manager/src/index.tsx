import React from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'
import { SafeProvider } from '@safe-global/safe-apps-react-sdk'

import { SafeWalletProvider } from 'src/store/safeWalletContext'
import { DelegateRegistryProvider } from 'src/store/delegateRegistryContext'
import GlobalStyles from 'src/GlobalStyles'
import App from 'src/App'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <SafeProvider>
        <SafeWalletProvider>
          <DelegateRegistryProvider>
            <App />
          </DelegateRegistryProvider>
        </SafeWalletProvider>
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
