import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import SafeAppsSDK, { ChainInfo, SafeInfo } from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { ethers } from 'ethers'

type safeWalletContextValue = {
  sdk: SafeAppsSDK
  safe: SafeInfo
  provider?: ethers.providers.Web3Provider
  chainInfo?: ChainInfo
  getAddressFromDomain: (ensName: string) => Promise<string>
}

const initialState = {
  sdk: new SafeAppsSDK(),
  safe: {
    safeAddress: '',
    chainId: 1,
    threshold: 1,
    owners: [],
    isReadOnly: true,
  },
  getAddressFromDomain: () => Promise.resolve(''),
}

const safeWalletContext = createContext<safeWalletContextValue>(initialState)

const useSafeWallet = () => {
  const context = useContext(safeWalletContext)

  if (!context) {
    throw new Error('useSafeWallet should be used within a Safe Wallet Context Provider')
  }

  return context
}

const SafeWalletProvider = ({ children }: { children: JSX.Element }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [chainInfo, setChainInfo] = useState<ChainInfo>()

  const { sdk, safe } = useSafeAppsSDK()

  // set ethers provider using SafeAppProvider
  useEffect(() => {
    if (safe?.safeAddress && sdk) {
      const provider = new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk))

      setProvider(provider)
    }
  }, [sdk, safe])

  // ENS name resolution
  const getAddressFromDomain = useCallback(
    async (ensName: string) => {
      return (await provider?.resolveName(ensName)) || ensName
    },
    [provider],
  )

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo()
        setChainInfo(chainInfo)
      } catch (e) {
        console.error('Unable to get chain info:', e)
      }
    }

    getChainInfo()
  }, [sdk])

  const state = {
    sdk,
    safe,

    provider,
    chainInfo,

    getAddressFromDomain, // ENS resolution
  }

  return <safeWalletContext.Provider value={state}>{children}</safeWalletContext.Provider>
}

export { useSafeWallet, SafeWalletProvider }
