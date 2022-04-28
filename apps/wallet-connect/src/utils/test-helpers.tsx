import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'

import GlobalStyles from '../global'

function renderWithProviders(ui: JSX.Element) {
  return render(
    <>
      <GlobalStyles />
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </>,
  )
}

export { renderWithProviders }
