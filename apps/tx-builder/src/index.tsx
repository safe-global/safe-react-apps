import ReactDOM from 'react-dom'
import { SafeProvider } from '@safe-global/safe-apps-react-sdk'
import { BrowserRouter } from 'react-router-dom'

import * as serviceWorker from './serviceWorker'

import GlobalStyles from './global'
import App from './App'
import StoreProvider from './store'
import SafeThemeProvider from './theme/SafeThemeProvider'
import { ThemeProvider } from 'styled-components'

ReactDOM.render(
  <>
    <GlobalStyles />
    <SafeThemeProvider>
      {theme => (
        <ThemeProvider theme={theme}>
          <SafeProvider>
            <StoreProvider>
              <BrowserRouter basename={process.env.PUBLIC_URL}>
                <App />
              </BrowserRouter>
            </StoreProvider>
          </SafeProvider>
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  </>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
