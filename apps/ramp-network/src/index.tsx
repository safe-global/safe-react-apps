import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { Loader, theme, Title } from '@gnosis.pm/safe-react-components'
import SafeProvider from '@safe-global/safe-apps-react-sdk'

import App from './App'

const AppLoader = () => (
  <>
    <Title size="md">Waiting for Safe...</Title>
    <Loader size="md" />
  </>
)

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SafeProvider loader={<AppLoader />}>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
