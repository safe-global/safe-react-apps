import { fetchJson } from '.';

export interface Asset {
  balance: string;
  fiatBalance: string;
  fiatConversion: string;
  tokenInfo: {
    address: string;
    decimals: number;
    logoUri: string | null;
    name: string;
    symbol: string;
    type: string;
  };
}

interface Balance {
  fiatTotal: string;
  items: Asset[];
}

export const CURRENCY = 'USD';

export async function fetchSafeAssets(safeAddress: string, safeNetwork: string): Promise<Balance> {
  const network = safeNetwork.toLowerCase(); // mainnet, rinkeby etc
  const url = `https://safe-client.${network}.gnosis.io/v1/safes/${safeAddress}/balances/${CURRENCY}/?trusted=false&exclude_spam=true`;
  const data = await fetchJson(url);
  return data as Balance;
}
