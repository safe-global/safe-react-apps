require('dotenv').config()
require('hardhat-deploy')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')

// tasks
require('./src/hardhat/tasks/deploy_contracts')

const networks = require('./src/hardhat/networks')

const { ETHERSCAN_API_KEY } = process.env

const hardhatConfig = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        runs: 1,
        enabled: true,
      },
    },
  },

  networks,

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: './src/contracts',
    tests: './src/test',
    cache: './src/cache',
    artifacts: './src/artifacts',
    deploy: './src/hardhat/deploy',
  },

  namedAccounts: {
    deployer: 0,
  },
}

module.exports = hardhatConfig
