export const rpcUrlGetterByNetwork: {
  [key in number]: null | ((token?: string) => string);
} = {
  1: (token) => `https://mainnet.infura.io/v3/${token}`,
  2: null,
  3: null,
  4: (token) => `https://rinkeby.infura.io/v3/${token}`,
  5: null,
  42: null,
  100: () => 'https://dai.poa.network',
  246: () => 'https://rpc.energyweb.org',
  73799: () => 'https://volta-rpc.energyweb.org',
  137: () => 'https://rpc-mainnet.matic.network',
};
