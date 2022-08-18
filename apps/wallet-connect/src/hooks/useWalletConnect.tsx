import { useState, useCallback, useEffect, useRef } from 'react'
import WalletConnect from '@walletconnect/client'
import { IClientMeta, IWalletConnectSession } from '@walletconnect/types'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { isMetaTxArray } from '../utils/transactions'
import { areStringsEqual } from '../utils/strings'

const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
  connector.rejectRequest({ id, error: { message } })
}

const useWalletConnect = () => {
  const { safe, sdk } = useSafeAppsSDK()
  const [wcClientData, setWcClientData] = useState<IClientMeta | null>(null)
  const [connector, setConnector] = useState<WalletConnect | undefined>()

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
          let result = '0x'

          switch (payload.method) {
            case 'eth_sendTransaction': {
              const txInfo = payload.params[0]
              const { safeTxHash } = await sdk.txs.send({
                txs: [
                  {
                    to: txInfo.to,
                    value: txInfo.value || '0x0',
                    data: txInfo.data || '0x',
                  },
                ],
              })

              result = safeTxHash
              break
            }
            case 'gs_multi_send': {
              const txs = payload.params

              if (!isMetaTxArray(txs)) {
                throw new Error('INVALID_TRANSACTIONS_PROVIDED')
              }

              const { safeTxHash } = await sdk.txs.send({
                txs: txs.map(txInfo => ({
                  to: txInfo.to,
                  value: (txInfo.value || '0x0').toString(),
                  data: txInfo.data || '0x',
                })),
              })

              result = safeTxHash
              break
            }

            case 'personal_sign': {
              const [message, address] = payload.params

              if (!areStringsEqual(address, safe.safeAddress)) {
                throw new Error('The address or message hash is invalid')
              }

              await sdk.txs.signMessage(message)

              result = '0x'
              break
            }

            case 'eth_sign': {
              const [address, messageHash] = payload.params

              if (!areStringsEqual(address, safe.safeAddress) || !messageHash.startsWith('0x')) {
                throw new Error('The address or message hash is invalid')
              }

              await sdk.txs.signMessage(messageHash)

              result = '0x'
              break
            }

            case 'eth_signTypedData_v4': {
              const [message, address] = payload.params

              if (!areStringsEqual(address, safe.safeAddress)) {
                throw new Error('The address or message hash is invalid')
              }

              await sdk.txs.signTypedMessage(message)

              result = '0x'
              break
            }
            default: {
              rejectWithMessage(wcConnector, payload.id, 'METHOD_NOT_SUPPORTED')
              break
            }
          }

          wcConnector.approveRequest({
            id: payload.id,
            result,
          })
        } catch (err) {
          rejectWithMessage(wcConnector, payload.id, (err as Error).message)
        }
      })

      wcConnector.on('disconnect', (error, payload) => {
        if (error) {
          throw error
        }
        wcDisconnect()
      })
    },
    [safe, sdk, wcDisconnect],
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
