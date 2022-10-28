import { useCallback, useEffect, useState } from 'react'
import { getSafeApps, SafeAppData, SafeAppsResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

// TODO: update this url?
const BASE_URL = 'https://safe-client.gnosis.io'

type UseAppsResponse = {
  findSafeApp: (safeAddress: string) => SafeAppData | undefined
  openSafeApp: (safeAppAddress: string) => void
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
        const appsList = await getSafeApps(BASE_URL, chainInfo.chainId)

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
        window.parent.location.href = `${origin}/app/${networkPrefix}:${safe.safeAddress}/apps?appUrl=${url}`
      }
    },
    [networkPrefix, origin, safe],
  )

  const findSafeApp = useCallback(
    (url: string): SafeAppData | undefined => {
      let { hostname } = new URL(url)

      return safeAppsList.find(safeApp => safeApp.url.includes(hostname))
    },
    [safeAppsList],
  )

  return { findSafeApp, openSafeApp }
}
