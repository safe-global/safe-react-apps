import React from 'react'
import ReactDOM from 'react-dom'
import SafeProvider from '@safe-global/safe-apps-react-sdk'
import { CssBaseline, Theme, ThemeProvider } from '@mui/material'
import { SafeThemeProvider } from '@safe-global/safe-react-components'
import App from './App'

import '@safe-global/safe-react-components/dist/fonts.css'

ReactDOM.render(
  <React.StrictMode>
    <SafeThemeProvider mode="light">
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          <CssBaseline />
          <SafeProvider loader={<h1>Waiting for Safe...</h1>}>
            <App />
          </SafeProvider>
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
