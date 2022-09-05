import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { VestingClaim } from "src/types/vestings"
import { calculateVestedAmount } from "src/utils/vesting"

export const useAmounts = (
  vestingClaim: VestingClaim | null
): [string, string] => {
  const [claimableAmount, setClaimableAmount] = useState("0")
  const [amountInVesting, setAmountInVesting] = useState("0")
  const [currentIntervalId, setCurrentIntervalId] = useState<number>()

  useEffect(() => {
    const refreshAmount = () => {
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
