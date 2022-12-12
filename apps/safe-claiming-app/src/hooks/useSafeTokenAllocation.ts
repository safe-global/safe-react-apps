import { Provider } from "@ethersproject/providers"
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { isPast } from "date-fns"
import { BigNumber } from "ethers"
import { defaultAbiCoder, Interface } from "ethers/lib/utils"
import { useMemo } from "react"
import { CHAIN_CONSTANTS, ZERO_ADDRESS } from "src/config/constants"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import useAsync from "./useAsync"

export const VESTING_URL =
  "https://safe-claiming-app-data.gnosis-safe.io/allocations/"

type VestingData = {
  tag: "user" | "ecosystem" | "investor"
  account: string
  chainId: number
  contract: string
  vestingId: string
  durationWeeks: number
  startDate: number
  amount: string
  curve: 0 | 1
  proof: string[]
}

export type Vesting = VestingData & {
  isExpired: boolean
  isRedeemed: boolean
  amountClaimed: string
}

// We currently do not have typechain as dependency so we fallback to human readable ABIs
const airdropInterface = new Interface([
  "function redeemDeadline() public returns (uint64)",
  "function vestings(bytes32) public returns ({address account, uint8 curveType,bool managed, uint16 durationWeeks, uint64 startDate, uint128 amount, uint128 amountClaimed, uint64 pausingDate,bool cancelled})",
])
const tokenInterface = new Interface([
  "function balanceOf(address _owner) public view returns (uint256 balance)",
])

/**
 * Add on-chain information to allocation.
 * Fetches if the redeem deadline is expired and the claimed tokens from on-chain
 */
const completeAllocation = async (
  allocation: VestingData,
  web3Provider: Provider
): Promise<Vesting> => {
  const onChainVestingData = await web3Provider.call({
    to: allocation.contract,
    data: airdropInterface.encodeFunctionData("vestings", [
      allocation.vestingId,
    ]),
  })

  const decodedVestingData = defaultAbiCoder.decode(
    // account, curveType, managed, durationWeeks, startDate, amount, amountClaimed, pausingDate, cancelled}
    [
      "address",
      "uint8",
      "bool",
      "uint16",
      "uint64",
      "uint128",
      "uint128",
      "uint64",
      "bool",
    ],
    onChainVestingData
  )
  const isRedeemed =
    decodedVestingData[0].toLowerCase() !== ZERO_ADDRESS.toLowerCase()
  if (isRedeemed) {
    return {
      ...allocation,
      isRedeemed,
      isExpired: false,
      amountClaimed: decodedVestingData[6],
    }
  }

  // Allocation is not yet redeemed => check the redeemDeadline
  const redeemDeadline = await web3Provider.call({
    to: allocation.contract,
    data: airdropInterface.encodeFunctionData("redeemDeadline"),
  })

  const redeemDeadlineDate = new Date(
    BigNumber.from(redeemDeadline).mul(1000).toNumber()
  )

  // Allocation is valid if redeem deadline is in future
  return {
    ...allocation,
    isRedeemed,
    isExpired: isPast(redeemDeadlineDate),
    amountClaimed: "0",
  }
}

const fetchAllocation = async (
  chainId: number,
  safeAddress: string
): Promise<VestingData[]> => {
  try {
    const response = await fetch(`${VESTING_URL}${chainId}/${safeAddress}.json`)

    // No file exists => the safe is not part of any vesting
    if (response.status === 404) {
      return Promise.resolve([]) as Promise<VestingData[]>
    }

    // Some other error
    if (!response.ok) {
      throw Error(`Error fetching vestings: ${response.statusText}`)
    }

    // Success
    return response.json() as Promise<VestingData[]>
  } catch (err) {
    throw Error(`Error fetching vestings: ${err}`)
  }
}

const fetchTokenBalance = async (
  chainId: number,
  safeAddress: string,
  web3Provider: Provider
): Promise<string> => {
  try {
    const safeTokenAddress = CHAIN_CONSTANTS[chainId].SAFE_TOKEN_ADDRESS
    if (!safeTokenAddress) return "0"

    return await web3Provider.call({
      to: safeTokenAddress,
      data: tokenInterface.encodeFunctionData("balanceOf", [safeAddress]),
    })
  } catch (err) {
    throw Error(`Error fetching Safe token balance:  ${err}`)
  }
}

/**
 * Fetches allocated tokens and combines it with the on-chain status of the vesting.
 */
const useSafeTokenAllocation = (): [
  { votingPower: BigNumber; vestingData: Vesting[] },
  boolean
] => {
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])

  const chainId = safe.chainId

  const [allocationData, _, allocationLoading] = useAsync<
    Vesting[] | undefined
  >(async () => {
    if (!safe.safeAddress) return
    return Promise.all(
      await fetchAllocation(safe.chainId, safe.safeAddress).then(
        (allocations) =>
          allocations.map((allocation) =>
            completeAllocation(allocation, web3Provider)
          )
      )
    )
    // If the history tag changes we could have claimed / redeemed tokens
  }, [chainId, safe.safeAddress, safe.chainId])

  const [balance, _error, balanceLoading] = useAsync<string>(() => {
    if (!safe.safeAddress) return
    return fetchTokenBalance(safe.chainId, safe.safeAddress, web3Provider)
    // If the history tag changes we could have claimed / redeemed tokens
  }, [chainId, safe.safeAddress, safe.chainId])

  const isLoading = allocationLoading || balanceLoading
  const votingPower = useMemo(() => {
    if (!allocationData || !balance) return

    const tokensInVesting = allocationData.reduce(
      (acc, data) =>
        data.isExpired ? acc : acc.add(data.amount).sub(data.amountClaimed),
      BigNumber.from(0)
    )

    // add balance
    const totalAllocation = tokensInVesting.add(balance || "0")
    return totalAllocation
  }, [allocationData, balance])

  return [
    {
      vestingData: allocationData ?? [],
      votingPower: votingPower ?? BigNumber.from(0),
    },
    isLoading,
  ]
}

export default useSafeTokenAllocation
