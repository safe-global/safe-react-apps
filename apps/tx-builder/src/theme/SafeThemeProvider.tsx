import { useMemo, type FC } from 'react'
import { type PaletteMode, type Theme } from '@mui/material'
import { ThemeProvider } from '@material-ui/core'
import createSafeTheme from './safeTheme'

type SafeThemeProviderProps = {
  children: (theme: Theme) => React.ReactNode
  mode: PaletteMode
}

const SafeThemeProvider: FC<SafeThemeProviderProps> = ({ children, mode }) => {
  const theme = useMemo(() => createSafeTheme(mode), [mode])

  return <ThemeProvider theme={theme}>{children(theme)}</ThemeProvider>
}

export default SafeThemeProvider
