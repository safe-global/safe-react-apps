import { useState, useEffect, useCallback } from 'react';
import { fetchSafeAssets, Asset } from '../utils/api';
import { networkByChainId } from '../utils/networks';

function useBalances(safeAddress: string, chainId: number): { error?: Error; assets: Asset[] } {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<Error>();

  const loadBalances = useCallback(async () => {
    if (!safeAddress || !chainId) {
      return;
    }

    try {
      const data = await fetchSafeAssets(safeAddress, networkByChainId[chainId]);
      setAssets(data);
    } catch (err) {
      setError(err as Error);
    }
  }, [safeAddress, chainId]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  return { error, assets };
}

export default useBalances;
