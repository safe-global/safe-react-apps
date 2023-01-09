import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { calculateVestedAmount } from "src/utils/vesting"
import { Vesting } from "./useSafeTokenAllocation"

export const useAmounts = (vestingClaim: Vesting | null): [string, string] => {
  const [claimableAmount, setClaimableAmount] = useState("0")
  const [amountInVesting, setAmountInVesting] = useState("0")

  useEffect(() => {
    const refreshAmount = () => {
      try {
        if (!vestingClaim) {
          return
        }
        const totalAmount = vestingClaim ? vestingClaim.amount : "0"
        let vestedAmount = vestingClaim
          ? calculateVestedAmount(vestingClaim)
          : "0"
        const amountClaimed = vestingClaim?.amountClaimed || "0"

        // If a user just claimed it can happen, that the amountClaimed is > vestedAmount for ~30s
        if (BigNumber.from(vestedAmount).lt(amountClaimed)) {
          vestedAmount = amountClaimed
        }

        const newClaimableAmount = BigNumber.from(vestedAmount)
          .sub(BigNumber.from(amountClaimed))
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
