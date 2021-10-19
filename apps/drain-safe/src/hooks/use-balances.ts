import { useState, useEffect, useCallback } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { TokenBalance } from '@gnosis.pm/safe-apps-sdk';

type TokenSpam = {
  spam: boolean | null;
};

export type DrainSafeTokenBalance = TokenBalance & TokenSpam;

function useBalances(
  safeAddress: string,
  chainId: number,
): { error?: Error; assets: DrainSafeTokenBalance[]; setAssets: (assets: DrainSafeTokenBalance[]) => void } {
  const { sdk } = useSafeAppsSDK();
  const [assets, setAssets] = useState<DrainSafeTokenBalance[]>([]);
  const [error, setError] = useState<Error>();

  const loadBalances = useCallback(async () => {
    if (!safeAddress || !chainId) {
      return;
    }

    try {
      const balances = await sdk.safe.experimental_getBalances({ currency: 'USD' });
      console.log('BALANCES', balances);
      // const data = await fetchSafeAssets(safeAddress, networkByChainId[chainId]);
      setAssets(
        balances.items.map((item) => ({
          ...item,
          spam: false,
        })),
      );
    } catch (err) {
      setError(err as Error);
    }
  }, [safeAddress, chainId, sdk.safe]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  return { error, assets, setAssets };
}

export default useBalances;
