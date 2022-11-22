import { useState, useCallback, useEffect, useMemo } from 'react'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, SessionTypes } from '@walletconnect/types'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { ethers } from 'ethers'

const { REACT_APP_WALLETCONNECT_PROJECT_ID, NODE_ENV } = process.env

const isProduction = NODE_ENV === 'production'

const safeAllowedMethods: string[] = [
  'eth_sendTransaction',
  // 'eth_signTransaction', // not implemented for Safe wallets
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
]

const EVMBasedNamespaces = 'eip155'

// no accountsChanged or chainChanged events are allowed for Safe Wallets
const safeAllowedEvents: string[] = []

export type wcConnectType = (uri: string) => Promise<void>
export type wcDisconnectType = () => Promise<void>

type useWalletConnectType = {
  wcClientData: SignClientTypes.Metadata | undefined
  wcConnect: wcConnectType
  wcDisconnect: wcDisconnectType
  isWallectConnectInitialized: boolean
}

const useWalletConnectV2 = (): useWalletConnectType => {
  const [signClient, setSignClient] = useState<SignClient>()
  const [wcSession, setWcSession] = useState<SessionTypes.Struct>()
  const [isWallectConnectInitialized, setIsWallectConnectInitialized] = useState<boolean>(false)

  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(
    () => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)),
    [sdk, safe],
  )

  const initializeWalletConnectClient = useCallback(async () => {
    const signClient = await SignClient.init({
      projectId: REACT_APP_WALLETCONNECT_PROJECT_ID,
      logger: isProduction ? undefined : 'debug',
      metadata: {
        name: 'Safe Wallet',
        description: 'The most trusted platform to manage digital assets on Ethereum',
        url: 'https://app.safe.global',
        // TODO: add icons
        icons: ['https://app.safe.global/favicons/favicon.ico'],
      },
    })
    const sessions = signClient.session.getAll()

    setSignClient(signClient)
    setWcSession(sessions[0])
    setIsWallectConnectInitialized(true)
  }, [])

  useEffect(() => {
    initializeWalletConnectClient()
  }, [initializeWalletConnectClient])

  // we set here the events & restore previous session
  useEffect(() => {
    const isWallectConnectInitialized = signClient && safe?.safeAddress && web3Provider

    if (isWallectConnectInitialized) {
      signClient.on(
        'session_proposal',
        async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
          const { id, params } = proposal
          const { requiredNamespaces, relays } = params

          const EIP155Namespace = requiredNamespaces[EVMBasedNamespaces]

          // only EVM-based (eip155) namespace allowed
          const isEIP155NamespaceDefined = !!EIP155Namespace
          const isOnlyEIP155NamespacePresent = Object.keys(requiredNamespaces).length === 1
          const isValidEIP155Connection = isEIP155NamespaceDefined && isOnlyEIP155NamespacePresent

          if (!isValidEIP155Connection) {
            await signClient.reject({
              id,
              reason: {
                code: 1006,
                message: `Only EVM-based (${EVMBasedNamespaces}) namespace allowed for your Safe Wallet`,
              },
            })
            return
          }

          // only safe.chainId connections are allowed
          const isChainIdValid = EIP155Namespace.chains[0].split(':')[1] === `${safe.chainId}`
          const isOnlySafeChainPresent = EIP155Namespace.chains.length === 1
          const isValidChainConnection = isOnlySafeChainPresent && isChainIdValid

          if (!isValidChainConnection) {
            await signClient.reject({
              id,
              reason: {
                code: 1006,
                message: `Only ${EVMBasedNamespaces}:${safe.chainId} namespace allowed for your Safe Wallet`,
              },
            })
            return
          }

          // no accountsChanged or chainChanged events are allowed for Safe Wallets
          const isEventsValid = EIP155Namespace.events.length === 0

          if (!isEventsValid) {
            await signClient.reject({
              id,
              reason: {
                code: 1006,
                message:
                  'no accountsChanged or chainChanged events are allowed for your Safe Wallet',
              },
            })
            return
          }

          const safeAccount = [`${EVMBasedNamespaces}:${safe.chainId}:${safe.safeAddress}`]

          const { acknowledged } = await signClient.approve({
            id,
            relayProtocol: relays[0].protocol,
            namespaces: {
              eip155: {
                accounts: safeAccount,
                methods: safeAllowedMethods,
                events: safeAllowedEvents,
              },
            },
          })

          const wcSession = await acknowledged()

          setWcSession(wcSession)
        },
      )

      signClient.on(
        'session_request',
        async (event: SignClientTypes.EventArguments['session_request']) => {
          const { topic, id } = event
          const { method, params } = event.params.request

          // TODO: https://docs.walletconnect.com/2.0/specs/sign/error-codes#invalid

          try {
            const result = await web3Provider.send(method, params)

            await signClient.respond({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                result,
              },
            })
          } catch (error: any) {
            console.log('walletconnect version 2 session_request error: ', error.message)
            signClient.respond({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                error: error.message,
              },
            })
          }
        },
      )

      signClient.on('session_event', (event: SignClientTypes.EventArguments['session_event']) => {
        // Handle session events, such as "chainChanged", "accountsChanged", etc.

        console.log('event: ', event)
      })

      signClient.on('session_ping', (event: SignClientTypes.EventArguments['session_ping']) => {
        // React to session ping event

        console.log('ping: ', event)
      })

      signClient.on('session_delete', (event: SignClientTypes.EventArguments['session_delete']) => {
        console.log('event: ', event)
        setWcSession(undefined)
      })
    }
  }, [safe, signClient, web3Provider])

  const wcConnect = useCallback<wcConnectType>(
    async (uri: string) => {
      const isValidWalletConnectUri = uri && uri.startsWith('wc')

      if (isValidWalletConnectUri && signClient) {
        await signClient.core.pairing.pair({ uri })
      }
    },
    [signClient],
  )

  const wcDisconnect = useCallback<wcDisconnectType>(async () => {
    if (wcSession && signClient) {
      setWcSession(undefined)
      await signClient.disconnect({
        topic: wcSession.topic,
        reason: {
          code: 6000, // TODO: check the code
          message: 'Safe Wallet Session ended by the user',
        },
      })
    }
  }, [signClient, wcSession])

  const wcClientData = wcSession?.peer.metadata

  return { wcConnect, wcClientData, wcDisconnect, isWallectConnectInitialized }
}

export default useWalletConnectV2
