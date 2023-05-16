require('hardhat-deploy')
require('@nomiclabs/hardhat-ethers')
const { task } = require('hardhat/config')

task('deploy-test-contracts', 'Deploys and verifies Test contracts').setAction(async (_, hre) => {
  await hre.run('deploy')
  await hre.run('sourcify')
  await hre.run('etherscan-verify', { forceLicense: true, license: 'LGPL-3.0' })
})

module.exports = {}
