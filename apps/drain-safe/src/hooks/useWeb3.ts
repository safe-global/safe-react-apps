import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

function useWeb3() {
  const [web3, setWeb3] = useState<Web3 | undefined>()
  const { sdk } = useSafeAppsSDK()

  useEffect(() => {
    const setWeb3Instance = async () => {
      const chainInfo = await sdk.safe.getChainInfo()

      if (!chainInfo) {
        return
      }

      const rpcUrlGetter = rpcUrlGetterByNetwork[chainInfo.chainId as CHAINS]

      if (!rpcUrlGetter) {
        throw Error(`RPC URL not defined for ${chainInfo.chainName} chain`)
      }

      const rpcUrl = rpcUrlGetter(process.env.REACT_APP_RPC_TOKEN)

      const web3Instance = new Web3(rpcUrl)

      setWeb3(web3Instance)
    }

    setWeb3Instance()
  }, [sdk.safe])

  return {
    web3,
  }
}

export default useWeb3

export enum CHAINS {
  MAINNET = '1',
  MORDEN = '2',
  ROPSTEN = '3',
  RINKEBY = '4',
  GOERLI = '5',
  OPTIMISM = '10',
  KOVAN = '42',
  BSC = '56',
  XDAI = '100',
  POLYGON = '137',
  ENERGY_WEB_CHAIN = '246',
  ARBITRUM = '42161',
  AVALANCHE = '43114',
  VOLTA = '73799',
  AURORA = '1313161554',
}

export const rpcUrlGetterByNetwork: {
  [key in CHAINS]: null | ((token?: string) => string)
} = {
  [CHAINS.MAINNET]: token => `https://mainnet.infura.io/v3/${token}`,
  [CHAINS.MORDEN]: null,
  [CHAINS.ROPSTEN]: null,
  [CHAINS.RINKEBY]: token => `https://rinkeby.infura.io/v3/${token}`,
  [CHAINS.GOERLI]: token => `https://goerli.infura.io/v3/${token}`,
  [CHAINS.OPTIMISM]: () => 'https://mainnet.optimism.io',
  [CHAINS.KOVAN]: null,
  [CHAINS.BSC]: () => 'https://bsc-dataseed.binance.org',
  [CHAINS.XDAI]: () => 'https://dai.poa.network',
  [CHAINS.POLYGON]: () => 'https://rpc-mainnet.matic.network',
  [CHAINS.ENERGY_WEB_CHAIN]: () => 'https://rpc.energyweb.org',
  [CHAINS.ARBITRUM]: () => 'https://arb1.arbitrum.io/rpc',
  [CHAINS.AVALANCHE]: () => 'https://api.avax.network/ext/bc/C/rpc',
  [CHAINS.VOLTA]: () => 'https://volta-rpc.energyweb.org',
  [CHAINS.AURORA]: () => 'https://mainnet.aurora.dev',
}
