import { LowercaseNetworks } from "@gnosis.pm/safe-apps-sdk";
export const chainIdByNetwork: { [key in LowercaseNetworks]: number } = {
  mainnet: 1,
  morden: 2,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  xdai: 100,
  energy_web_chain: 246,
  volta: 73799,
  unknown: 1337,
};

export const gnosisUrlByNetwork = {
  mainnet: "https://gnosis-safe.io/app",
  morden: null,
  ropsten: null,
  rinkeby: "https://safe-team-rinkeby.staging.gnosisdev.com",
  goerli: null,
  kovan: null,
  unknown: null,
};
