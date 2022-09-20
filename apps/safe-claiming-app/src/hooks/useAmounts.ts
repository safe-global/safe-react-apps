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
  const [currentIntervalId, setCurrentIntervalId] = useState<number>()
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = getWeb3Provider(safe, sdk)

  useEffect(() => {
    const refreshAmount = async () => {
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
    }

    if (!vestingClaim) {
      return
    }

    if (currentIntervalId) {
      window.clearInterval(currentIntervalId)
      setCurrentIntervalId(undefined)
    }

    refreshAmount()
    const refreshAmountInterval = window.setInterval(refreshAmount, 10000)
    setCurrentIntervalId(refreshAmountInterval)

    return () => window.clearInterval(refreshAmountInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vestingClaim])

  return [claimableAmount, amountInVesting]
}
