import { Networks } from '@gnosis.pm/safe-apps-sdk';

const chainIdByNetwork: { [key in Networks]: number } = {
  MAINNET: 1,
  MORDEN: 2,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  XDAI: 100,
  ENERGY_WEB_CHAIN: 246,
  VOLTA: 73799,
  UNKNOWN: 1337,
};

const gnosisUrlByNetwork: {
  [key in Networks]: null | string;
} = {
  MAINNET: 'https://gnosis-safe.io/app/#',
  MORDEN: null,
  ROPSTEN: null,
  RINKEBY: 'https://safe-team-rinkeby.staging.gnosisdev.com/app/#',
  GOERLI: null,
  KOVAN: null,
  XDAI: null,
  ENERGY_WEB_CHAIN: 'https://ewc.gnosis-safe.io/app/#',
  VOLTA: 'https://volta.gnosis-safe.io/app/#',
  UNKNOWN: null,
};

export { chainIdByNetwork, gnosisUrlByNetwork };
