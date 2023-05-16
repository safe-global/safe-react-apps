const { task } = require('hardhat/config')
require('@nomiclabs/hardhat-ethers')

task('read-method', 'Read a method from a test contract')
  .addParam('address', "The contract's address")
  .addParam('method', "The contract's method")
  .setAction(async ({ address, method }, hre) => {
    await hre.run('compile')
    console.log('\n')

    console.log('contract address: ', address)
    console.log('reading method: ', method)
    console.log('network: ', hre.network.name, '\n')

    const contracts = await hre.artifacts.getAllFullyQualifiedNames()

    await Promise.all(
      contracts.map(async contract => {
        const artifact = await hre.artifacts.readArtifact(contract)

        const Contract = await hre.ethers.getContractFactory(artifact.contractName)

        const contractMethod = (await Contract.attach(address))[method]

        if (contractMethod) {
          console.log(method, 'read method found on', artifact.contractName)

          const value = await contractMethod()

          console.log('value: ', value, '\n')
        }
      }),
    )
  })

module.exports = {}
