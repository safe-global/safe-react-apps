import fetchJson from './fetch-json';

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  logoUri: string;
}

export interface Asset {
  balance: string;
  ethValue: string;
  timestamp: string;
  fiatBalance: string;
  fiatConversion: string;
  fiatCode: string;
  tokenAddress: string | null;
  token: Token | null;
  spam: boolean | null;
}

export const CURRENCY = 'USD';

export async function fetchSafeAssets(safeAddress: string, safeNetwork: string): Promise<Asset[]> {
  const network = safeNetwork.toLowerCase(); // mainnet, rinkeby etc
  const url = `https://safe-transaction.${network}.gnosis.io/api/v1/safes/${safeAddress}/balances/${CURRENCY.toLowerCase()}/?exclude_spam=true`;
  const data = await fetchJson(url);

  return data as Asset[];
}
