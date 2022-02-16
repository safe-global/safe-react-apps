import { useCallback, useEffect, useState } from 'react';
import { getSafeApps, SafeAppsResponse } from '@gnosis.pm/safe-react-gateway-sdk';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

const BASE_URL = 'https://safe-client.gnosis.io';

export function useApps() {
  const { sdk } = useSafeAppsSDK();
  const [safeAppsList, setSafeAppsList] = useState<SafeAppsResponse>([]);

  useEffect(() => {
    (async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo();
        const safeAppsList = await getSafeApps(BASE_URL, chainInfo.chainId);
        setSafeAppsList(safeAppsList);
      } catch (error) {
        console.error('Unable to get chain info:', error);
      }
    })();
  }, [sdk.safe]);

  const findSafeApp = useCallback(
    (url: string) => {
      let { hostname } = new URL(url);

      return safeAppsList.find((safeApp) => safeApp.url.includes(hostname));
    },
    [safeAppsList],
  );

  return { findSafeApp };
}
