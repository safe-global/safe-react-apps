import { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { render, RenderResult } from '@testing-library/react'
import { theme } from '@gnosis.pm/safe-react-components'
import { SafeProvider } from '@safe-global/safe-apps-react-sdk'
import { BrowserRouter } from 'react-router-dom'
import StoreProvider from './store'

const renderWithProviders = (Components: ReactElement): RenderResult => {
  return render(
    <ThemeProvider theme={theme}>
      <SafeProvider>
        <StoreProvider>
          <BrowserRouter>{Components}</BrowserRouter>
        </StoreProvider>
      </SafeProvider>
    </ThemeProvider>,
  )
}

export * from '@testing-library/react'
export { renderWithProviders as render }
