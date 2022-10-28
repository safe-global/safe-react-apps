import { useCallback } from 'react'
import { CoreTypes } from '@walletconnect/types'
import useWalletConnectV1 from './useWalletConnectV1'
import useWalletConnectV2 from './useWalletConnectV2'

export type wcConnectType = (uri: string) => Promise<void>
export type wcDisconnectType = () => Promise<void>

export type useWalletConnectType = {
  wcConnect: wcConnectType
  wcDisconnect: wcDisconnectType
  wcSessionData: CoreTypes.Metadata | undefined
}

const useWalletConnect = (): useWalletConnectType => {
  const {
    wcConnect: wcConnectV1,
    wcClientData: wcSessionV1,
    wcDisconnect: wcDisconnectV1,
  } = useWalletConnectV1()

  const {
    wcConnect: wcConnectV2,
    wcSession: wcSessionV2,
    wcDisconnect: wcDisconnectV2,
  } = useWalletConnectV2()

  const wcConnect = useCallback<wcConnectType>(
    async (uri: string) => {
      // walletconnect URI follows eip-1328 standard
      // see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1328.md
      const walletConnectVersion = getWalletConnectVersion(uri)
      const isWalletConnectV1 = walletConnectVersion === '1'

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

  const wcSessionData = wcSessionV1 || wcSessionV2?.peer?.metadata

  return { wcConnect, wcSessionData, wcDisconnect }
}

export default useWalletConnect

const getWalletConnectVersion = (uri: string): string => {
  const version = uri?.split('@')?.[1]?.[0]

  return version
}
