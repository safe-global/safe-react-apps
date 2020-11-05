import { LowercaseNetworks } from "@gnosis.pm/safe-apps-sdk";

export const rpcUrlGetterByNetwork: {
  [key in LowercaseNetworks]: null | ((token?: string) => string);
} = {
  mainnet: (token) => `https://mainnet.infura.io/v3/${token}`,
  morden: null,
  ropsten: null,
  rinkeby: (token) => `https://rinkeby.infura.io/v3/${token}`,
  goerli: null,
  kovan: null,
  xdai: () => "https://dai.poa.network/",
  energy_web_chain: () => "https://rpc.energyweb.org",
  volta: () => "https://volta-rpc.energyweb.org",
  unknown: null,
};
