require('dotenv').config()

const { INFURA_KEY, PRIVATE_KEY } = process.env

const sharedConfig = {
  accounts: [`0x${PRIVATE_KEY}`],
}

const MAINNET_CONFIG = {
  ...sharedConfig,
  url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
}

const GNOSIS_CHAIN_CONFIG = {
  ...sharedConfig,
  url: 'https://xdai.poanetwork.dev',
}

const POLYGON_CONFIG = {
  ...sharedConfig,
  url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
}

const BSC_CONFIG = {
  ...sharedConfig,
  url: 'https://bsc-dataseed.binance.org/',
}

const ARBITRUM_CONFIG = {
  ...sharedConfig,
  url: 'https://arb1.arbitrum.io/rpc',
}

const AVALANCHE_CONFIG = {
  ...sharedConfig,
  url: 'https://api.avax.network/ext/bc/C/rpc',
}

const RINKEBY_CONFIG = {
  ...sharedConfig,
  url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
}

const GOERLI_CONFIG = {
  ...sharedConfig,
  url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
}

const VOLTA_CONFIG = {
  ...sharedConfig,
  url: 'https://volta-rpc.energyweb.org',
}

const networks = {
  hardhat: {},
  localhost: {},

  mainnet: MAINNET_CONFIG,
  xdai: GNOSIS_CHAIN_CONFIG,
  polygon: POLYGON_CONFIG,
  bsc: BSC_CONFIG,
  arbitrum: ARBITRUM_CONFIG,
  avalanche: AVALANCHE_CONFIG,

  // testnets
  rinkeby: RINKEBY_CONFIG,
  goerli: GOERLI_CONFIG,
  volta: VOLTA_CONFIG,
}

module.exports = networks
