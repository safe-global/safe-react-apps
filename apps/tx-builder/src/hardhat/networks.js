require('dotenv').config()

const { INFURA_KEY, PRIVATE_KEY } = process.env

const sharedConfig = {
  accounts: [`0x${PRIVATE_KEY}`],
}

const RINKEBY_CONFIG = {
  ...sharedConfig,
  url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  network_id: 4,
}

const GNOSIS_CHAIN_CONFIG = {
  ...sharedConfig,
  url: 'https://xdai.poanetwork.dev',
  network_id: 100,
}

// TODO: ADD MORE CHAINS

const networks = {
  hardhat: {},
  localhost: {},
  rinkeby: RINKEBY_CONFIG,
  xdai: GNOSIS_CHAIN_CONFIG,
}

module.exports = networks
