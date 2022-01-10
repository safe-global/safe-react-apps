import daiIcon from './images/asset_DAI.svg';
import batIcon from './images/asset_BAT.svg';
import wbtcIcon from './images/asset_BTC.svg';
import ethIcon from './images/asset_ETH.svg';
import repIcon from './images/asset_REP.svg';
import usdcIcon from './images/asset_USDC.svg';
import usdtIcon from './images/asset_USDT.svg';
import zrxIcon from './images/asset_ZRX.svg';
import tokens from './tokens';
import { CHAINS } from './utils/networks';

export type TokenItem = {
  id: string;
  label: string;
  iconUrl: string;
  decimals: number;
  tokenAddr: string;
  cTokenAddr: string;
};

export const rpc_token = process.env.REACT_APP_RPC_TOKEN || '';

export const getTokenList = (chainId: number): Array<TokenItem> => {
  if (chainId !== CHAINS.RINKEBY && chainId !== CHAINS.MAINNET) {
    throw Error(`Not supported Chain id ${chainId}`);
  }

  const tokensByNetwork = tokens[chainId];

  if (!tokensByNetwork) {
    throw Error(`No token configuration for chain id: ${chainId}`);
  }

  return [
    {
      id: 'DAI',
      label: 'DAI',
      iconUrl: daiIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.DAI,
      cTokenAddr: tokensByNetwork.cDAI,
    },
    {
      id: 'BAT',
      label: 'BAT',
      iconUrl: batIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.BAT,
      cTokenAddr: tokensByNetwork.cBAT,
    },
    {
      id: 'ETH',
      label: 'ETH',
      iconUrl: ethIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.ETH,
      cTokenAddr: tokensByNetwork.cETH,
    },
    {
      id: 'REP',
      label: 'REP',
      iconUrl: repIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.REP,
      cTokenAddr: tokensByNetwork.cREP,
    },
    {
      id: 'USDC',
      label: 'USDC',
      iconUrl: usdcIcon,
      decimals: 6,
      tokenAddr: tokensByNetwork.USDC,
      cTokenAddr: tokensByNetwork.cUSDC,
    },
    {
      id: 'USDT',
      label: 'USDT',
      iconUrl: usdtIcon,
      decimals: 6,
      tokenAddr: tokensByNetwork.USDT,
      cTokenAddr: tokensByNetwork.cUSDT,
    },
    {
      id: 'WBTC',
      label: 'WBTC',
      iconUrl: wbtcIcon,
      decimals: 8,
      tokenAddr: tokensByNetwork.WBTC,
      cTokenAddr: tokensByNetwork.cWBTC,
    },
    {
      id: 'ZRX',
      label: 'ZRX',
      iconUrl: zrxIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.ZRX,
      cTokenAddr: tokensByNetwork.cZRX,
    },
  ];
};
