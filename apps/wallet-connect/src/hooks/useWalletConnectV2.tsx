import { useState, useCallback, useEffect, useMemo } from 'react'
import { SignClientTypes, SessionTypes, CoreTypes } from '@walletconnect/types'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { ChainInfo } from '@safe-global/safe-apps-sdk'
import { ethers } from 'ethers'
import { Core } from '@walletconnect/core'
import Web3WalletType, { Web3Wallet } from '@walletconnect/web3wallet'

import {
  NEW_SESSION_ACTION,
  TRANSACTION_CONFIRMED_ACTION,
  WalletConnectVersion,
  WALLET_CONNECT_VERSION_2,
} from '../utils/analytics'
import { isProduction, SAFE_WALLET_METADATA, WALLETCONNECT_V2_PROJECT_ID } from '../constants'

const EVMBasedNamespaces: string = 'eip155'

// see full list here: https://github.com/safe-global/safe-apps-sdk/blob/main/packages/safe-apps-provider/src/provider.ts#L35
export const compatibleSafeMethods: string[] = [
  'eth_accounts',
  'net_version',
  'eth_chainId',
  'personal_sign',
  'eth_sign',
  'eth_signTypedData',
  'eth_signTypedData_v4',
  'eth_sendTransaction',
  'eth_blockNumber',
  'eth_getBalance',
  'eth_getCode',
  'eth_getTransactionCount',
  'eth_getStorageAt',
  'eth_getBlockByNumber',
  'eth_getBlockByHash',
  'eth_getTransactionByHash',
  'eth_getTransactionReceipt',
  'eth_estimateGas',
  'eth_call',
  'eth_getLogs',
  'eth_gasPrice',
  'wallet_getPermissions',
  'wallet_requestPermissions',
  'safe_setSettings',
]

// see https://docs.walletconnect.com/2.0/specs/sign/error-codes
const UNSUPPORTED_CHAIN_ERROR_CODE = 5100
const INVALID_METHOD_ERROR_CODE = 1001
const USER_REJECTED_REQUEST_CODE = 4001
const USER_DISCONNECTED_CODE = 6000

const logger = isProduction ? undefined : 'debug'

export const errorLabel =
  'We were unable to create a connection due to compatibility issues with the latest WalletConnect v2 upgrade. We are actively working with the WalletConnect team and the dApps to get these issues resolved. Use Safe Apps instead wherever possible.'

export type wcConnectType = (uri: string) => Promise<void>
export type wcDisconnectType = () => Promise<void>

type useWalletConnectType = {
  wcClientData: SignClientTypes.Metadata | undefined
  wcConnect: wcConnectType
  wcDisconnect: wcDisconnectType
  isWallectConnectInitialized: boolean
  error: string | undefined
}

const useWalletConnectV2 = (
  trackEvent: (action: string, version: WalletConnectVersion, meta?: CoreTypes.Metadata) => void,
): useWalletConnectType => {
  const [web3wallet, setWeb3wallet] = useState<Web3WalletType>()

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

  // Initializing v2, see https://docs.walletconnect.com/2.0/javascript/web3wallet/wallet-usage
  useEffect(() => {
    const initializeWalletConnectV2Client = async () => {
      const core = new Core({
        projectId: WALLETCONNECT_V2_PROJECT_ID,
        logger,
      })

      const web3wallet = await Web3Wallet.init({
        core,
        metadata: SAFE_WALLET_METADATA,
      })

      setWeb3wallet(web3wallet)
    }

    try {
      initializeWalletConnectV2Client()
    } catch (error) {
      console.log('Error on walletconnect version 2 initialization: ', error)
      setIsWallectConnectInitialized(true)
    }
  }, [])

  // session_request needs to be a separate Effect because a valid wcSession should be present
  useEffect(() => {
    if (isWallectConnectInitialized && web3wallet && wcSession) {
      web3wallet.on('session_request', async event => {
        const { topic, id } = event
        const { request, chainId: transactionChainId } = event.params
        const { method, params } = request

        const isSafeChainId = transactionChainId === `${EVMBasedNamespaces}:${safe.chainId}`

        // we only accept transactions from the Safe chain
        if (!isSafeChainId) {
          const errorMessage = `Transaction rejected: the connected Dapp is not set to the correct chain. Make sure the Dapp only uses ${chainInfo?.chainName} to interact with this Safe.`
          setError(errorMessage)
          await web3wallet.respondSessionRequest({
            topic,
            response: rejectResponse(id, UNSUPPORTED_CHAIN_ERROR_CODE, errorMessage),
          })
          return
        }

        try {
          setError(undefined)
          const result = await web3Provider.send(method, params)
          await web3wallet.respondSessionRequest({
            topic,
            response: {
              id,
              jsonrpc: '2.0',
              result,
            },
          })

          trackEvent(
            TRANSACTION_CONFIRMED_ACTION,
            WALLET_CONNECT_VERSION_2,
            wcSession.peer.metadata,
          )
        } catch (error: any) {
          setError(error?.message)
          const isUserRejection = error?.message?.includes?.('Transaction was rejected')
          const code = isUserRejection ? USER_REJECTED_REQUEST_CODE : INVALID_METHOD_ERROR_CODE
          await web3wallet.respondSessionRequest({
            topic,
            response: rejectResponse(id, code, error.message),
          })
        }
      })
    }
  }, [
    chainInfo,
    wcSession,
    isWallectConnectInitialized,
    web3wallet,
    trackEvent,
    safe,
    web3Provider,
  ])

  // we set here the events & restore an active previous session
  useEffect(() => {
    if (!isWallectConnectInitialized && web3wallet) {
      // we try to find a compatible active session
      const activeSessions = web3wallet.getActiveSessions()
      const compatibleSession = Object.keys(activeSessions)
        .map(topic => activeSessions[topic])
        .find(
          session =>
            session.namespaces[EVMBasedNamespaces].accounts[0] ===
            `${EVMBasedNamespaces}:${safe.chainId}:${safe.safeAddress}`, // Safe Account
        )

      if (compatibleSession) {
        setWcSession(compatibleSession)
      }

      // events
      web3wallet.on('session_proposal', async proposal => {
        const { id, params } = proposal
        const { requiredNamespaces } = params

        console.log('Session proposal: ', proposal)

        const safeAccount = `${EVMBasedNamespaces}:${safe.chainId}:${safe.safeAddress}`
        const safeChain = `${EVMBasedNamespaces}:${safe.chainId}`
        const safeEvents = requiredNamespaces[EVMBasedNamespaces]?.events || [] // we accept all events like chainChanged & accountsChanged (even if they are not compatible with the Safe)

        try {
          const wcSession = await web3wallet.approveSession({
            id,
            namespaces: {
              eip155: {
                accounts: [safeAccount], // only the Safe account
                chains: [safeChain], // only the Safe chain
                methods: compatibleSafeMethods, // only the Safe methods
                events: safeEvents,
              },
            },
          })

          trackEvent(NEW_SESSION_ACTION, WALLET_CONNECT_VERSION_2, wcSession.peer.metadata)

          setWcSession(wcSession)
          setError(undefined)
        } catch (error: any) {
          console.log('error: ', error)

          // human readeable error
          setError(errorLabel)

          const errorMessage = `Connection refused: This Safe Account is in ${chainInfo?.chainName} but the Wallet Connect session proposal is not valid because it contains: 1) A required chain different than ${chainInfo?.chainName} 2) Does not include ${chainInfo?.chainName} between the optional chains 3) No EVM compatible chain is included`
          console.log(errorMessage)
          await web3wallet.rejectSession({
            id: proposal.id,
            reason: {
              code: UNSUPPORTED_CHAIN_ERROR_CODE,
              message: errorMessage,
            },
          })
        }
      })

      web3wallet.on('session_delete', async () => {
        setWcSession(undefined)
        setError(undefined)
      })

      setIsWallectConnectInitialized(true)
    }
  }, [safe, web3wallet, isWallectConnectInitialized, chainInfo, trackEvent])

  const wcConnect = useCallback<wcConnectType>(
    async (uri: string) => {
      const isValidWalletConnectUri = uri && uri.startsWith('wc')

      if (isValidWalletConnectUri && web3wallet) {
        await web3wallet.core.pairing.pair({ uri })
      }
    },
    [web3wallet],
  )

  const wcDisconnect = useCallback<wcDisconnectType>(async () => {
    if (wcSession && web3wallet) {
      await web3wallet.disconnectSession({
        topic: wcSession.topic,
        reason: {
          code: USER_DISCONNECTED_CODE,
          message: 'User disconnected. Safe Wallet Session ended by the user',
        },
      })
      setWcSession(undefined)
      setError(undefined)
    }
  }, [web3wallet, wcSession])

  const wcClientData = wcSession?.peer.metadata

  return { wcConnect, wcClientData, wcDisconnect, isWallectConnectInitialized, error }
}

export default useWalletConnectV2

const rejectResponse = (id: number, code: number, message: string) => {
  return {
    id,
    jsonrpc: '2.0',
    error: {
      code,
      message,
    },
  }
}
