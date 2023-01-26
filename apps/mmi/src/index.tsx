import React from 'react'
import ReactDOM from 'react-dom'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createSafeTheme } from '@safe-global/safe-react-components'

import App from './App'

import '@safe-global/safe-react-components/dist/fonts.css'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={createSafeTheme('dark')}>
      <CssBaseline />
      <SafeProvider loader={<h1>Waiting for Safe...</h1>}>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
