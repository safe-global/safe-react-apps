const RINKEBY_ETHERSCAN_URL = 'https://rinkeby.etherscan.io'
const TEST_CONTRACT_NAME = 'MatrixTypesTestContract'

async function main() {
  // A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  const TestContract = await ethers.getContractFactory(TEST_CONTRACT_NAME)

  console.log('Deploying Test Contract...')
  console.log('')

  // Start deployment, returning a promise that resolves to a contract object
  const { address: testContractAddress } = await TestContract.deploy()

  console.log('New Matrix Test Contract deployed in Rinkeby')
  console.log('')

  console.log('Matrix Test Contract Address: ', testContractAddress)
  console.log('')

  const etherscanUrl = `${RINKEBY_ETHERSCAN_URL}/address/${testContractAddress}`
  console.log('Etherscan URL: ', etherscanUrl)
  console.log('')

  const verifyCommand = `yarn contract:verify:rinkeby ${testContractAddress}`
  console.log('To verify the contract, run: ')
  console.log('')
  console.log('       ', verifyCommand)
  console.log('')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
