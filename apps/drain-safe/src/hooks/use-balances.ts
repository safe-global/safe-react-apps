import { useState, useEffect, useCallback } from 'react';
import { fetchSafeAssets, Asset } from '../utils/api';

function useBalances(safeAddress: string, network: string): { error?: Error; assets: Asset[] } {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<Error>();

  const loadBalances = useCallback(async () => {
    if (!safeAddress || !network) {
      return;
    }

    try {
      const data = await fetchSafeAssets(safeAddress, network);
      setAssets(data);
    } catch (err) {
      setError(err);
    }
  }, [safeAddress, network]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  return { error, assets };
}

export default useBalances;
