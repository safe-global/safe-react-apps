import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { VestingClaim } from "src/types/vestings"
import { getWeb3Provider } from "src/utils/getWeb3Provider"
import { calculateVestedAmount } from "src/utils/vesting"

export const useAmounts = (
  vestingClaim: VestingClaim | null
): [string, string] => {
  const [claimableAmount, setClaimableAmount] = useState("0")
  const [amountInVesting, setAmountInVesting] = useState("0")
  const { safe, sdk } = useSafeAppsSDK()

  useEffect(() => {
    const refreshAmount = async () => {
      try {
        const web3Provider = getWeb3Provider(safe, sdk)

        // get timestamp from latest block
        const latestBlock = await web3Provider.getBlock("latest")
        const blockTimestamp = latestBlock.timestamp
        const totalAmount = vestingClaim ? vestingClaim.amount : "0"
        const vestedAmount = vestingClaim
          ? calculateVestedAmount(vestingClaim, blockTimestamp)
          : "0"
        const newClaimableAmount = BigNumber.from(vestedAmount)
          .sub(BigNumber.from(vestingClaim?.amountClaimed || "0"))
          .toString()

        const newAmountInVesting = BigNumber.from(totalAmount)
          .sub(BigNumber.from(vestedAmount))
          .toString()

        setClaimableAmount(newClaimableAmount)
        setAmountInVesting(newAmountInVesting)
      } catch (error) {
        // We ignore errors as we will retry it every 10 seconds anyway
        console.error(error)
      }
    }

    if (!vestingClaim) {
      return
    }

    refreshAmount()
    const refreshAmountInterval = window.setInterval(refreshAmount, 10000)

    return () => window.clearInterval(refreshAmountInterval)
  }, [safe, sdk, vestingClaim])

  return [claimableAmount, amountInVesting]
}
