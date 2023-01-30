import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/client'
import { IClientMeta, IWalletConnectSession } from '@walletconnect/legacy-types'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'

import {
  NEW_SESSION_ACTION,
  TRANSACTION_CONFIRMED_ACTION,
  WalletConnectVersion,
  WALLET_CONNECT_VERSION_1,
} from '../utils/analytics'

const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
  connector.rejectRequest({ id, error: { message } })
}

const useWalletConnectV1 = (
  trackEvent: (action: string, version: WalletConnectVersion, meta?: IClientMeta | null) => void,
) => {
  const { safe, sdk } = useSafeAppsSDK()
  const [wcClientData, setWcClientData] = useState<IClientMeta | null>(null)
  const [connector, setConnector] = useState<WalletConnect | undefined>()
  const web3Provider = useMemo(
    () => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)),
    [sdk, safe],
  )

  const localStorageSessionKey = useRef(`session_${safe.safeAddress}`)

  const wcDisconnect = useCallback(async () => {
    try {
      await connector?.killSession()
      setConnector(undefined)
      setWcClientData(null)
    } catch (error) {
      console.log('Error trying to close WC session: ', error)
    }
  }, [connector])

  const wcConnect = useCallback(
    async ({ uri, session }: { uri?: string; session?: IWalletConnectSession }) => {
      const wcConnector = new WalletConnect({
        uri,
        session,
        storageId: localStorageSessionKey.current,
      })
      setConnector(wcConnector)
      setWcClientData(wcConnector.peerMeta)

      wcConnector.on('session_request', (error, payload) => {
        if (error) {
          throw error
        }

        wcConnector.approveSession({
          accounts: [safe.safeAddress],
          chainId: safe.chainId,
        })

        trackEvent(NEW_SESSION_ACTION, WALLET_CONNECT_VERSION_1, wcConnector.peerMeta)

        setWcClientData(payload.params[0].peerMeta)
      })

      wcConnector.on('call_request', async (error, payload) => {
        if (error) {
          throw error
        }

        try {
          let result = await web3Provider.send(payload.method, payload.params)

          trackEvent(TRANSACTION_CONFIRMED_ACTION, WALLET_CONNECT_VERSION_1, wcConnector.peerMeta)

          wcConnector.approveRequest({
            id: payload.id,
            result,
          })
        } catch (err) {
          rejectWithMessage(wcConnector, payload.id, (err as Error).message)
        }
      })

      wcConnector.on('disconnect', error => {
        if (error) {
          throw error
        }
        wcDisconnect()
      })
    },
    [safe, wcDisconnect, web3Provider, trackEvent],
  )

  useEffect(() => {
    if (!connector) {
      const session = localStorage.getItem(localStorageSessionKey.current)
      if (session) {
        wcConnect({ session: JSON.parse(session) })
      }
    }
  }, [connector, wcConnect])

  return { wcClientData, wcConnect, wcDisconnect }
}

export default useWalletConnectV1
