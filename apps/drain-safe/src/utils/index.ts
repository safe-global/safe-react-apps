import { Networks } from '@gnosis.pm/safe-apps-sdk';

export const rpcUrlGetterByNetwork: {
  [key in Networks]: null | ((token?: string) => string);
} = {
  MAINNET: (token) => `https://mainnet.infura.io/v3/${token}`,
  MORDEN: null,
  ROPSTEN: null,
  RINKEBY: (token) => `https://rinkeby.infura.io/v3/${token}`,
  GOERLI: null,
  KOVAN: null,
  XDAI: () => 'https://dai.poa.network',
  ENERGY_WEB_CHAIN: () => 'https://rpc.energyweb.org',
  VOLTA: () => 'https://volta-rpc.energyweb.org',
  UNKNOWN: null,
};

export const fetchJson = async function fetchJson(url: string): Promise<unknown> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Network response was not ok');
  }
  return resp.json();
};
