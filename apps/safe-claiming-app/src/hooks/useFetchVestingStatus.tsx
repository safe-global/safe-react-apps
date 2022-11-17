import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { ZERO_ADDRESS } from "src/config/constants"
import useAsync, { type AsyncResult } from "src/hooks/useAsync"
import { Airdrop__factory } from "src/types/contracts/factories/Airdrop__factory"
import { VestingStatus } from "src/types/vestings"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { ethers } from "ethers"

const getVestingStatus = async (
  airdropAddress: string | undefined,
  web3Provider: ethers.providers.Provider,
  vestingId: string | undefined
): Promise<VestingStatus | undefined> => {
  if (!vestingId || !airdropAddress) {
    return
  }

  try {
    // Check if vesting is already redeemed and amount claimed
    const newVesting = await Airdrop__factory.connect(
      airdropAddress,
      web3Provider
    ).vestings(vestingId)

    if (newVesting.account.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
      return {
        isRedeemed: false,
        amountClaimed: "0",
      }
    }
    return {
      amountClaimed: newVesting.amountClaimed.toString(),
      isRedeemed: true,
    }
  } catch (error) {
    console.error(error)
    throw Error("Error fetching vesting status")
  }
}

export const useFetchVestingStatus = (
  vestingId: string | undefined,
  airdropAddress: string | undefined
): AsyncResult<VestingStatus> => {
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = getWeb3Provider(safe, sdk)

  return useAsync(
    () => getVestingStatus(airdropAddress, web3Provider, vestingId),
    [airdropAddress, vestingId, web3Provider]
  )
}
