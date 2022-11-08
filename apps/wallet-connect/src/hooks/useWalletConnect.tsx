import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/client'
import { IClientMeta, IWalletConnectSession } from '@walletconnect/types'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'

const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
  connector.rejectRequest({ id, error: { message } })
}

const useWalletConnect = () => {
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

        setWcClientData(payload.params[0].peerMeta)
      })

      wcConnector.on('call_request', async (error, payload) => {
        if (error) {
          throw error
        }

        try {
          let result = await web3Provider.send(payload.method, payload.params)

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
    [safe, wcDisconnect, web3Provider],
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

export default useWalletConnect
