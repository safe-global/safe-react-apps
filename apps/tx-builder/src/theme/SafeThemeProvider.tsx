import { useEffect, useMemo, useState, type FC } from 'react'
import { type Theme } from '@mui/material'
import { ThemeProvider } from '@material-ui/core'
import createSafeTheme from './safeTheme'
import { getSDKVersion } from '@safe-global/safe-apps-sdk'

type SafeThemeProviderProps = {
  children: (theme: Theme) => React.ReactNode
}

const SafeThemeProvider: FC<SafeThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false)

  const theme = useMemo(() => createSafeTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode])

  useEffect(() => {
    window.parent.postMessage(
      {
        id: 'tx-builder',
        env: { sdkVersion: getSDKVersion() },
        method: 'getCurrentTheme',
      },
      '*',
    )

    window.addEventListener('message', function (event) {
      if (!event.data?.data.hasOwnProperty('darkMode')) return

      setDarkMode(event.data?.data.darkMode)
    })
  }, [])

  return <ThemeProvider theme={theme}>{children(theme)}</ThemeProvider>
}

export default SafeThemeProvider
