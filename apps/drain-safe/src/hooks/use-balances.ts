import { useState, useEffect, useCallback } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { TokenBalance } from '@gnosis.pm/safe-apps-sdk';

export type BalancesType = {
  error?: Error;
  assets: TokenBalance[];
  excludedTokens: string[];
  setExcludedTokens: (tokens: string[]) => void;
};

function useBalances(safeAddress: string, chainId: number): BalancesType {
  const { sdk } = useSafeAppsSDK();
  const [assets, setAssets] = useState<TokenBalance[]>([]);
  const [excludedTokens, setExcludedTokens] = useState<string[]>([]);
  const [error, setError] = useState<Error>();

  const loadBalances = useCallback(async () => {
    if (!safeAddress || !chainId) {
      return;
    }

    try {
      const balances = await sdk.safe.experimental_getBalances({ currency: 'USD' });

      setAssets(balances.items);
    } catch (err) {
      setError(err as Error);
    }
  }, [safeAddress, chainId, sdk]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  return { error, assets, excludedTokens, setExcludedTokens };
}

export default useBalances;
