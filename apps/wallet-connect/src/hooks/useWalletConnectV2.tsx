import { useState, useCallback, useEffect, useMemo } from 'react'
import SignClient from '@walletconnect/sign-client'
import { SignClientTypes, SessionTypes } from '@walletconnect/types'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { ChainInfo } from '@gnosis.pm/safe-apps-sdk'
import { ethers } from 'ethers'

const { REACT_APP_WALLETCONNECT_PROJECT_ID, NODE_ENV } = process.env

const isProduction = NODE_ENV === 'production'

const safeAllowedMethods: string[] = [
  'eth_sendTransaction',
  'eth_signTransaction', // not implemented for Safe wallets
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
]

// accountsChanged or chainChanged events are not allowed for Safe Wallets
const safeAllowedEvents: string[] = ['accountsChanged', 'chainChanged']

const EVMBasedNamespaces = 'eip155'

// see https://docs.walletconnect.com/2.0/specs/sign/session-namespaces#example-proposal-namespaces-request
const REJECT_SESSION_ERROR_CODE = 1006
// see https://docs.walletconnect.com/2.0/specs/sign/error-codes
const UNSUPPORTED_CHAIN_ERROR_CODE = 5100
const INVALID_METHOD_ERROR_CODE = 1001
const USER_DISCONNECTED_CODE = 6000
const USER_REJECTED_REQUEST_CODE = 4001

export type wcConnectType = (uri: string) => Promise<void>
export type wcDisconnectType = () => Promise<void>

type useWalletConnectType = {
  wcClientData: SignClientTypes.Metadata | undefined
  wcConnect: wcConnectType
  wcDisconnect: wcDisconnectType
  isWallectConnectInitialized: boolean
  error: string | undefined
}

const useWalletConnectV2 = (): useWalletConnectType => {
  const [signClient, setSignClient] = useState<SignClient>()
  const [wcSession, setWcSession] = useState<SessionTypes.Struct>()
  const [isWallectConnectInitialized, setIsWallectConnectInitialized] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [chainInfo, setChainInfo] = useState<ChainInfo>()

  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(
    () => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)),
    [sdk, safe],
  )

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo()
        setChainInfo(chainInfo)
      } catch (error) {
        console.error('Unable to get chain info:', error)
      }
    }

    getChainInfo()
  }, [sdk.safe])

  const initializeWalletConnectClient = useCallback(async () => {
    const signClient = await SignClient.init({
      projectId: REACT_APP_WALLETCONNECT_PROJECT_ID,
      logger: isProduction ? undefined : 'debug',
      metadata: {
        name: 'Safe Wallet',
        description: 'The most trusted platform to manage digital assets on Ethereum',
        url: 'https://app.safe.global',
        icons: [
          'https://app.safe.global/favicons/mstile-150x150.png',
          'https://app.safe.global/favicons/logo_120x120.png',
        ],
      },
    })

    setSignClient(signClient)
    setIsWallectConnectInitialized(true)
  }, [])

  useEffect(() => {
    initializeWalletConnectClient()
  }, [initializeWalletConnectClient])

  // we set here the events & restore previous session
  useEffect(() => {
    const isWallectConnectInitialized = signClient && safe?.safeAddress && web3Provider

    if (isWallectConnectInitialized) {
      // we try to find a compatible active sesssion
      const activeSessions = signClient.session.getAll()
      const compatibleSession = activeSessions.find(session =>
        session.namespaces[EVMBasedNamespaces].accounts.includes(
          `${EVMBasedNamespaces}:${safe.chainId}:${safe.safeAddress}`,
        ),
      )
      setWcSession(compatibleSession)

      // events
      signClient.on(
        'session_proposal',
        async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
          const { id, params } = proposal
          const { requiredNamespaces, relays } = params
          const EIP155Namespace = requiredNamespaces[EVMBasedNamespaces]

          // at least a EVM-based (eip155) namespace should be present
          const isEIP155NamespacePresent = !!EIP155Namespace

          if (!isEIP155NamespacePresent) {
            await signClient.reject({
              id,
              reason: {
                code: REJECT_SESSION_ERROR_CODE,
                message: `No EVM-based (${EVMBasedNamespaces}) namespace present in the session proposal`,
              },
            })
            return
          }

          // Safe chainId should be present
          const isSafeChainIdPresent = EIP155Namespace.chains.some(
            chain => chain === `${EVMBasedNamespaces}:${safe.chainId}`,
          )

          if (!isSafeChainIdPresent) {
            await signClient.reject({
              id,
              reason: {
                code: REJECT_SESSION_ERROR_CODE,
                message: `No ${chainInfo?.chainName} (${EVMBasedNamespaces}:${safe.chainId}) namespace present in the session proposal`,
              },
            })
            return
          }

          // As a workaround we lie to the Dapp, accepting all EVM accounts, methods & events
          const safeAccount = EIP155Namespace.chains.map(chain => `${chain}:${safe.safeAddress}`)

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
        async (request: SignClientTypes.EventArguments['session_request']) => {
          const { topic, id } = request
          const { method, params } = request.params.request
          const transactionChainId = request.params.chainId
          const isSafeChainId = transactionChainId === `${EVMBasedNamespaces}:${safe.chainId}`

          // we only accept transactions from the Safe chain
          if (!isSafeChainId) {
            const errorMessage = `Transaction rejected: the connected Dapp is not set to the correct chain. Make sure the Dapp uses ${chainInfo?.chainName} to interact with this Safe.`
            setError(errorMessage)
            await signClient.respond({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                error: {
                  code: UNSUPPORTED_CHAIN_ERROR_CODE,
                  message: errorMessage,
                },
              },
            })
            return
          }

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
            setError(undefined)
          } catch (error: any) {
            const isUserRejection = error?.message?.includes?.('Transaction was rejected')
            const code = isUserRejection ? USER_REJECTED_REQUEST_CODE : INVALID_METHOD_ERROR_CODE
            signClient.respond({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                error: {
                  code,
                  message: error.message,
                },
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
        setWcSession(undefined)
        setError(undefined)
      })
    }
  }, [safe, signClient, web3Provider, chainInfo])

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
      setError(undefined)
      await signClient.disconnect({
        topic: wcSession.topic,
        reason: {
          code: USER_DISCONNECTED_CODE,
          message: 'Safe Wallet Session ended by the user',
        },
      })
    }
  }, [signClient, wcSession])

  const wcClientData = wcSession?.peer.metadata

  return { wcConnect, wcClientData, wcDisconnect, isWallectConnectInitialized, error }
}

export default useWalletConnectV2
