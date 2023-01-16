import { RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'
import { Web3Provider } from '@ethersproject/providers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import type { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import type { EIP1193Provider } from '@web3-onboard/core'
import type { RpcUri } from '@safe-global/safe-gateway-typescript-sdk'

import { INFURA_TOKEN } from '@/config/constants'

const formatRpcServiceUrl = ({ authentication, value }: RpcUri, TOKEN: string): string => {
  const needsToken = authentication === RPC_AUTHENTICATION.API_KEY_PATH
  return needsToken ? `${value}${TOKEN}` : value
}

export const getRpcServiceUrl = (rpcUri: RpcUri): string => {
  return formatRpcServiceUrl(rpcUri, INFURA_TOKEN)
}

export const createSafeProvider = ({ safe, sdk }: ReturnType<typeof useSafeAppsSDK>) => {
  const safeAppProvider = new SafeAppProvider(safe, sdk)
  return new Web3Provider(safeAppProvider)
}

export const createWeb3Provider = (walletProvider: EIP1193Provider): Web3Provider => {
  return new Web3Provider(walletProvider)
}
