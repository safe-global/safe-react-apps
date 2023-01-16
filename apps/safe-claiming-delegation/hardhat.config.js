/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.7.6', // DelegateRegistry
      },
      {
        version: '0.8.4', // SafeToken
      },
    ],
  },
}
