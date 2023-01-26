import { useCallback } from 'react'
import { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import { CoreTypes } from '@walletconnect/types'
import { IClientMeta } from '@walletconnect/legacy-types'

import useWalletConnectV1 from './useWalletConnectV1'
import useWalletConnectV2 from './useWalletConnectV2'
import { trackSafeAppEvent, WalletConnectVersion } from '../utils/analytics'
import { useApps } from './useApps'

export type wcConnectType = (uri: string) => Promise<void>
export type wcDisconnectType = () => Promise<void>
export type MetadataType = CoreTypes.Metadata | IClientMeta | null

export type useWalletConnectType = {
  wcConnect: wcConnectType
  wcDisconnect: wcDisconnectType
  wcClientData: CoreTypes.Metadata | undefined
  isWallectConnectInitialized: boolean
  error: string | undefined
  findSafeApp: (safeAppUrl: string) => SafeAppData | undefined
  openSafeApp: (safeAppUrl: string) => void
}

const useWalletConnect = (): useWalletConnectType => {
  const { findSafeApp, openSafeApp } = useApps()

  const trackEvent = useCallback(
    (action: string, version: WalletConnectVersion, meta?: MetadataType) => {
      if (!meta) return

      const safeApp = meta && findSafeApp(meta.url)

      trackSafeAppEvent(action, version, safeApp?.name || meta?.url)
    },
    [findSafeApp],
  )

  // wallet-connect v1
  const {
    wcConnect: wcConnectV1,
    wcClientData: wcSessionV1,
    wcDisconnect: wcDisconnectV1,
  } = useWalletConnectV1(trackEvent)

  // wallet-connect v2
  const {
    wcConnect: wcConnectV2,
    wcClientData: wcSessionV2,
    wcDisconnect: wcDisconnectV2,
    isWallectConnectInitialized,
    error,
  } = useWalletConnectV2(trackEvent)

  const wcConnect = useCallback<wcConnectType>(
    async (uri: string) => {
      // walletconnect URI follows eip-1328 standard
      // see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1328.md
      const walletConnectVersion = getWalletConnectVersion(uri)
      const isWalletConnectV1 = walletConnectVersion === '1'

      // we need to keep both v1 & v2 versions, see https://docs.walletconnect.com/2.0/javascript/sign/wallet-usage#migrating-from-v1x
      if (isWalletConnectV1) {
        wcConnectV1({ uri })
      } else {
        wcConnectV2(uri)
      }
    },
    [wcConnectV1, wcConnectV2],
  )

  const wcDisconnect = useCallback<wcDisconnectType>(async () => {
    wcDisconnectV1()
    wcDisconnectV2()
  }, [wcDisconnectV1, wcDisconnectV2])

  const wcClientData = wcSessionV1 || wcSessionV2

  return {
    wcConnect,
    wcClientData,
    wcDisconnect,
    isWallectConnectInitialized,
    error,
    findSafeApp,
    openSafeApp,
  }
}

export default useWalletConnect

const getWalletConnectVersion = (uri: string): string => {
  const encodedURI = encodeURI(uri)
  const version = encodedURI?.split('@')?.[1]?.[0]

  return version
}
