import React from 'react'
import ReactDOM from 'react-dom'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material'
import App from './App'
import theme from './theme'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ body: { paddingBottom: '24px' } }} />
      <CssBaseline />
      <SafeProvider loader={<h1>Waiting for Safe...</h1>}>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
