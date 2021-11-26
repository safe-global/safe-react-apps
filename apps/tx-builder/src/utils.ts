export enum CHAINS {
  MAINNET = '1',
  MORDEN = '2',
  ROPSTEN = '3',
  RINKEBY = '4',
  GOERLI = '5',
  KOVAN = '42',
  BSC = '56',
  XDAI = '100',
  POLYGON = '137',
  ENERGY_WEB_CHAIN = '246',
  ARBITRUM = '42161',
  VOLTA = '73799',
}

export const rpcUrlGetterByNetwork: {
  [key in CHAINS]: null | ((token?: string) => string);
} = {
  [CHAINS.MAINNET]: (token) => `https://mainnet.infura.io/v3/${token}`,
  [CHAINS.MORDEN]: null,
  [CHAINS.ROPSTEN]: null,
  [CHAINS.RINKEBY]: (token) => `https://rinkeby.infura.io/v3/${token}`,
  [CHAINS.GOERLI]: null,
  [CHAINS.KOVAN]: null,
  [CHAINS.BSC]: () => 'https://bsc-dataseed.binance.org',
  [CHAINS.XDAI]: () => 'https://dai.poa.network',
  [CHAINS.POLYGON]: () => 'https://rpc-mainnet.matic.network',
  [CHAINS.ENERGY_WEB_CHAIN]: () => 'https://rpc.energyweb.org',
  [CHAINS.ARBITRUM]: () => 'https://arb1.arbitrum.io/rpc',
  [CHAINS.VOLTA]: () => 'https://volta-rpc.energyweb.org',
};
