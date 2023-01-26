import { useState, useEffect, useCallback } from 'react'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { TokenBalance } from '@safe-global/safe-apps-sdk'
import { NATIVE_TOKEN } from '../utils/sdk-helpers'

export type BalancesType = {
  assets: TokenBalance[]
  error?: Error
  loaded: boolean
  selectedTokens: string[]
  setSelectedTokens: (tokens: string[]) => void
}

const transferableTokens = (item: TokenBalance) =>
  item.tokenInfo.type !== NATIVE_TOKEN ||
  (item.tokenInfo.type === NATIVE_TOKEN && Number(item.fiatBalance) !== 0)

function useBalances(safeAddress: string, chainId: number): BalancesType {
  const { sdk } = useSafeAppsSDK()
  const [assets, setAssets] = useState<TokenBalance[]>([])
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [error, setError] = useState<Error>()
  const [loaded, setLoaded] = useState(false)

  const loadBalances = useCallback(async () => {
    if (!safeAddress || !chainId) {
      return
    }

    try {
      const balances = await sdk.safe.experimental_getBalances({
        currency: 'USD',
      })
      const assets = balances.items.filter(transferableTokens)

      setAssets(assets)
      setSelectedTokens(assets.map((token: TokenBalance) => token.tokenInfo.address))
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoaded(true)
    }
  }, [safeAddress, chainId, sdk])

  useEffect(() => {
    loadBalances()
  }, [loadBalances])

  return { assets, error, loaded, selectedTokens, setSelectedTokens }
}

export default useBalances
