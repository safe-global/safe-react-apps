import { CHAINS } from './utils/networks';
import { cToken, getMarkets } from './http/compoundApi';
import STATIC_CONFIG from './tokens';

export type TokenItem = {
  id: string;
  label: string;
  iconUrl: string;
  decimals: number;
  tokenAddr: string;
  cTokenAddr: string;
};

const ETH_UNDERLYING_ADDRESS: { [key: number]: string } = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  4: '0xc778417e063141139fce010982780140aa0cd5ab',
};

const EXCLUDE_TOKENS = ['cWBTC', 'cSAI', 'cREP'];

const getSymbolIconUrl = (symbol: string) =>
  `https://app.compound.finance/compound-components/assets/asset_${symbol === 'WBTC' ? 'BTC' : symbol}.svg`;

const filterTokens = (token: cToken) => !EXCLUDE_TOKENS.includes(token.symbol);
const orderTokensBySymbol = (a: cToken, b: cToken) => ('' + a.underlying_symbol).localeCompare(b.underlying_symbol);
const transformFromCompoundResponse = (token: cToken, chainId: number) => {
  return {
    id: token.underlying_symbol,
    label: token.underlying_symbol,
    iconUrl: getSymbolIconUrl(token.underlying_symbol),
    decimals: token.cash.value.split('.')[1].length,
    tokenAddr: token.underlying_symbol === 'ETH' ? ETH_UNDERLYING_ADDRESS[chainId] : token.underlying_address,
    cTokenAddr: token.token_address,
  };
};

export const getTokenList = async (chainId: number): Promise<TokenItem[]> => {
  if (chainId !== CHAINS.RINKEBY && chainId !== CHAINS.MAINNET) {
    throw Error(`Not supported Chain id ${chainId}`);
  }

  if (chainId === CHAINS.RINKEBY) {
    return STATIC_CONFIG;
  }

  const cToken = await getMarkets();

  return cToken
    .filter(filterTokens)
    .sort(orderTokensBySymbol)
    .map((token: cToken) => transformFromCompoundResponse(token, chainId));
};
