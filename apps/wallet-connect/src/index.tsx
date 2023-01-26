import ReactDOM from 'react-dom'
import App from './App'
import { SafeProvider } from '@safe-global/safe-apps-react-sdk'
import { Loader, theme } from '@gnosis.pm/safe-react-components'
import { ThemeProvider } from 'styled-components'

import GlobalStyles from './global'

ReactDOM.render(
  <>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <SafeProvider loader={<Loader size="md" />}>
        <App />
      </SafeProvider>
    </ThemeProvider>
  </>,
  document.getElementById('root'),
)
