require('dotenv').config()
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env

const RINKEBY_CHAIN_ID = 4

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        runs: 1,
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {},
    localhost: {},
    rinkeby: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      network_id: RINKEBY_CHAIN_ID,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: './src/contracts',
    tests: './src/test',
    cache: './src/cache',
    artifacts: './src/artifacts',
  },
}
