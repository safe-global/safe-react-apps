import { useCallback, useEffect, useState } from 'react'
import { getSafeApps, SafeAppData, SafeAppsResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

const BASE_URL = 'https://safe-client.safe.global'

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
        window.open(`${origin}/${networkPrefix}:${safe.safeAddress}/apps?appUrl=${url}`, '_blank')
      }
    },
    [networkPrefix, origin, safe],
  )

  const findSafeApp = useCallback(
    (url: string): SafeAppData | undefined => {
      try {
        let { hostname } = new URL(url)

        return safeAppsList.find(safeApp => safeApp.url.includes(hostname))
      } catch (err) {
        return undefined
      }
    },
    [safeAppsList],
  )

  return { findSafeApp, openSafeApp }
}
