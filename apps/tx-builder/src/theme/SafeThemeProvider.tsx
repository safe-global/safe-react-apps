import React, { useEffect, useMemo, useState, type FC } from 'react'
import { type Theme } from '@mui/material'
import { ThemeProvider } from '@material-ui/core'
import createSafeTheme from './safeTheme'
import { getSDKVersion } from '@safe-global/safe-apps-sdk'

export enum EModes {
  DARK = 'dark',
  LIGHT = 'light',
}

type SafeThemeProviderProps = {
  children: (theme: Theme) => React.ReactNode
}

export const ThemeModeContext = React.createContext<string>(EModes.LIGHT)

const SafeThemeProvider: FC<SafeThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState(EModes.LIGHT)

  const theme = useMemo(() => createSafeTheme(mode), [mode])

  useEffect(() => {
    window.parent.postMessage(
      {
        id: 'tx-builder',
        env: { sdkVersion: getSDKVersion() },
        method: 'getCurrentTheme',
      },
      '*',
    )

    window.addEventListener('message', function ({ data: eventData }) {
      if (!eventData?.data?.hasOwnProperty('darkMode')) return

      setMode(eventData?.data.darkMode ? EModes.DARK : EModes.LIGHT)
    })
  }, [])

  return (
    <ThemeModeContext.Provider value={mode}>
      <ThemeProvider theme={theme}>{children(theme)}</ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export default SafeThemeProvider
