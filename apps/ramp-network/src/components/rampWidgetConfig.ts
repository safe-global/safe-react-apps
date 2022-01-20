import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';

const RINKEBY_STAGING_URL = 'https://ri-widget-staging.firebaseapp.com/';

export const getRampWidgetUrl = (chainInfo: ChainInfo) => {
  return chainInfo?.chainId === '4' ? RINKEBY_STAGING_URL : '';
};

export const ASSETS_BY_CHAIN: { [key: string]: string } = {
  '1': 'ETH_*,ERC20_*',
  '4': 'ETH_*,ERC20_*',
  '56': 'BSC_*',
  '100': 'XDAI_*',
  '137': 'MATIC_*',
  '43114': 'AVAX_*',
};
