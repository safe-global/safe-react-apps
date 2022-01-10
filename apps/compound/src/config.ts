import tokens from './tokens';
import { CHAINS } from './utils/networks';
import { cToken, getMarkets } from './http/compoundApi';

export type TokenItem = {
  id: string;
  label: string;
  iconUrl: string;
  decimals: number;
  tokenAddr: string;
  cTokenAddr: string;
};

const getSymbolIconUrl = (symbol: string) =>
  `https://app.compound.finance/compound-components/assets/asset_${symbol === 'WBTC' ? 'BTC' : symbol}.svg`;

export const getTokenList = async (chainId: number): Promise<TokenItem[]> => {
  if (chainId !== CHAINS.RINKEBY && chainId !== CHAINS.MAINNET) {
    throw Error(`Not supported Chain id ${chainId}`);
  }

  const tokensByNetwork = tokens[chainId];

  if (!tokensByNetwork) {
    throw Error(`No token configuration for chain id: ${chainId}`);
  }

  const cToken = await getMarkets();

  return cToken
    .filter((token: cToken) => token.symbol !== 'cWBTC')
    .sort((a: cToken, b: cToken) => ('' + a.underlying_symbol).localeCompare(b.underlying_symbol))
    .map((token: cToken) => {
      return {
        id: token.underlying_symbol,
        label: token.underlying_symbol,
        iconUrl: getSymbolIconUrl(token.underlying_symbol),
        decimals: 18,
        tokenAddr:
          token.underlying_symbol === 'ETH' ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : token.underlying_address,
        cTokenAddr: token.token_address,
      };
    });
};
