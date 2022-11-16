import React from 'react'
import ReactDOM from 'react-dom'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { ThemeProvider } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'
import App from './App'
import GlobalStyle from './global'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <SafeProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </SafeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
