import { useCallback, useEffect, useState } from 'react'
import {
  getSafeApps,
  SafeAppData,
  SafeAppsResponse,
} from '@safe-global/safe-gateway-typescript-sdk'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'

type UseAppsResponse = {
  findSafeApp: (safeAppUrl: string) => SafeAppData | undefined
  openSafeApp: (safeAppUrl: string) => void
}

export function useApps(): UseAppsResponse {
  const { safe, sdk } = useSafeAppsSDK()
  const [safeAppsList, setSafeAppsList] = useState<SafeAppsResponse>([])
  const [origin, setOrigin] = useState<string>()
  const [networkPrefix, setNetworkPrefix] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo()
        const environmentInfo = await sdk.safe.getEnvironmentInfo()
        const appsList = await getSafeApps(chainInfo.chainId)

        setOrigin(environmentInfo.origin)
        setSafeAppsList(appsList)
        setNetworkPrefix(chainInfo.shortName)
      } catch (error) {
        console.error('Unable to get chain info:', error)
      }
    })()
  }, [sdk])

  const openSafeApp = useCallback(
    (url: string) => {
      if (origin?.length) {
        window.open(
          `${origin}/apps/open?safe=${networkPrefix}:${safe.safeAddress}&appUrl=${url}`,
          '_blank',
        )
      }
    },
    [networkPrefix, origin, safe],
  )

  const findSafeApp = useCallback(
    (url: string): SafeAppData | undefined => {
      try {
        const { hostname } = new URL(url)

        return safeAppsList.find(safeApp => safeApp.url.includes(hostname))
      } catch (error) {
        console.error('Unable to find Safe App:', error)
      }
    },
    [safeAppsList],
  )

  return { findSafeApp, openSafeApp }
}
