import { useState, useCallback, useEffect, useMemo } from 'react'
import { ethers } from 'ethers'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, SessionTypes } from '@walletconnect/types'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'

const { REACT_APP_WALLETCONNECT_PROJECT_ID } = process.env

export type wcConnectType = (uri: string) => Promise<void>
export type wcDisconnectType = () => Promise<void>

type useWalletConnectType = {
  wcSession: SessionTypes.Struct | undefined
  wcConnect: wcConnectType
  wcDisconnect: wcDisconnectType
}

const useWalletConnectV2 = (): useWalletConnectType => {
  const [signClient, setSignClient] = useState<SignClient>()
  const [wcSession, setWcSession] = useState<SessionTypes.Struct>()

  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(
    () => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)),
    [sdk, safe],
  )

  const initializeWalletConnectClient = useCallback(async () => {
    const signClient = await SignClient.init({
      projectId: REACT_APP_WALLETCONNECT_PROJECT_ID,
      // optional parameters
      // logger: 'debug',
      // TODO: DO WE NEED A relayUrl ??
      // relayUrl: "<YOUR RELAY URL>",
      metadata: {
        name: 'Safe Wallet',
        description: 'Safe Wallet short description',
        url: 'https://gnosis-safe.io/app/welcome',
        icons: [
          'https://safe-transaction-assets.gnosis-safe.io/contracts/logos/0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2.png',
        ],
      },
    })

    setSignClient(signClient)
  }, [])

  useEffect(() => {
    initializeWalletConnectClient()
  }, [initializeWalletConnectClient])

  // we set here the events
  useEffect(() => {
    const isWallectConnectInitialized = signClient && safe?.safeAddress && web3Provider

    if (isWallectConnectInitialized) {
      signClient.on(
        'session_proposal',
        async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
          console.log('onSessionProposal event: ', proposal)
          const { id, params } = proposal
          // const { proposer, requiredNamespaces, relays } = params
          const { requiredNamespaces, relays } = params

          const namespace = requiredNamespaces['eip155']

          // TODO: check that only the current chain should be present
          // TODO: check namespace methods
          // TODO: check namespace events

          // const { topic, acknowledged } = await signClient.approve({
          const { acknowledged } = await signClient.approve({
            id,
            relayProtocol: relays[0].protocol,
            namespaces: {
              eip155: {
                accounts: [`eip155:${safe.chainId}:${safe.safeAddress}`],
                methods: namespace.methods,
                events: namespace.events,
                // extension: [
                //   {
                //     accounts: ['eip:137'],
                //     methods: ['eth_sign'],
                //     events: [],
                //   },
                // ],
              },
            },
          })

          const wcSession = await acknowledged()

          setWcSession(wcSession)

          console.log('wcSession: ', wcSession)
        },
      )

      signClient.on(
        'session_request',
        async (event: SignClientTypes.EventArguments['session_request']) => {
          const { topic, id } = event
          const { method, params } = event.params.request

          try {
            const hash = await web3Provider.send(method, params)

            await signClient.respond({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                result: hash,
              },
            })
          } catch (error: any) {
            console.log('error: ', error.message)
            signClient.respond({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                result: error.message,
              },
            })
          }
        },
      )

      signClient.on('session_delete', (event: SignClientTypes.EventArguments['session_delete']) => {
        setWcSession(undefined)
      })
    }
  }, [safe, signClient, web3Provider])

  const wcConnect = useCallback<wcConnectType>(
    async (uri: string) => {
      const isValidWalletConnectUri = uri && uri.startsWith('wc:')

      if (isValidWalletConnectUri && signClient) {
        console.log('uri: ', uri)
        const pairResponse = await signClient.pair({ uri })
        console.log('pairResponse: ', pairResponse)
      }
    },
    [signClient],
  )

  const wcDisconnect = useCallback<wcDisconnectType>(async () => {
    if (wcSession && signClient) {
      setWcSession(undefined)
      signClient.disconnect({
        topic: wcSession.topic,
        reason: {
          code: 6000,
          message: 'test',
        },
      })
    }
  }, [signClient, wcSession])

  return { wcConnect, wcSession, wcDisconnect }
}

export default useWalletConnectV2
