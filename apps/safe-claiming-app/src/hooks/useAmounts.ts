import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { VestingClaim } from "src/types/vestings"
import { calculateVestedAmount } from "src/utils/vesting"

export const useAmounts = (
  vestingClaim: VestingClaim | null
): [string, string] => {
  const [claimableAmount, setClaimableAmount] = useState("0")
  const [amountInVesting, setAmountInVesting] = useState("0")

  useEffect(() => {
    const refreshAmount = () => {
      try {
        if (!vestingClaim) {
          return
        }
        const totalAmount = vestingClaim ? vestingClaim.amount : "0"
        const vestedAmount = vestingClaim
          ? calculateVestedAmount(vestingClaim)
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
  }, [vestingClaim])

  return [claimableAmount, amountInVesting]
}
