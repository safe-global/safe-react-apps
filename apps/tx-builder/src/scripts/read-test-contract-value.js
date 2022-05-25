const RINKEBY_ETHERSCAN_URL = 'https://rinkeby.etherscan.io'

const TEST_CONTRACT_NAME = 'MatrixTypesTestContract' // Contract Name to read (BasicTypesTestContract or MatrixTypesTestContract)
const TEST_CONTRACT_ADDRESS = '0x6623c1C4B8694C0982a5274037C059c6803bEA52' // The contract address
const TEST_CONTRACT_METHOD = 'getUInt128DynamicMatrixValue' // method to read

// command: npx hardhat run --network rinkeby src/scripts/read-test-contract-value.js,

async function main() {
  // A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  const TestContract = await ethers.getContractFactory(TEST_CONTRACT_NAME)

  const testContract = await TestContract.attach(TEST_CONTRACT_ADDRESS)

  const values = await testContract[TEST_CONTRACT_METHOD]()

  console.log(TEST_CONTRACT_METHOD, values)

  // read as a string
  // console.log(
  //   TEST_CONTRACT_METHOD,
  //   values.map(value => value.map(value => value.toString())),
  // )
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
