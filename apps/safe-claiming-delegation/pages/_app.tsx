import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { useMemo } from 'react'
import { CacheProvider } from '@emotion/react'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
} from '@mui/material/styles'
import { useMediaQuery, CssBaseline } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import type { EmotionCache } from '@emotion/react'
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'

import { useInitOnboard } from '@/hooks/useOnboard'
import { useInitWeb3 } from '@/hooks/useWeb3'
import initTheme from '@/styles/theme'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { useChains } from '@/hooks/useChains'
import { PageLayout } from '@/components/PageLayout'
import { getQueryClient } from '@/services/QueryClient'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useInitWallet } from '@/hooks/useWallet'
import { EnsureWalletConnection } from '@/components/EnsureWalletConnection'
import { createEmotionCache } from '@/styles/emotion'

import '@/styles/globals.css'

const InitApp = (): null => {
  useInitOnboard()
  useInitWeb3()
  useInitWallet()

  // Populate cache
  useChains()
  useDelegatesFile()
  useIsTokenPaused()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const queryClient = getQueryClient()

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache
}

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps): ReactElement => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => {
    const colorSchemedTheme = initTheme(prefersDarkMode)
    // Extend the theme with the CssVarsProvider
    return extendMuiTheme(colorSchemedTheme)
  }, [prefersDarkMode])

  return (
    <CacheProvider value={emotionCache}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />

        <SafeProvider>
          <QueryClientProvider client={queryClient}>
            <InitApp />

            <PageLayout>
              <EnsureWalletConnection>
                {/* 
                // @ts-expect-error type mismatch with Next and React */}
                <Component {...pageProps} />
              </EnsureWalletConnection>
            </PageLayout>
          </QueryClientProvider>
        </SafeProvider>
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default App
