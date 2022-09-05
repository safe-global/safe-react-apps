import { BigNumber } from "ethers"
import { VestingClaim } from "src/types/vestings"

const LINEAR_CURVE = 0
const EXPONENTIAL_CURVE = 1

export const calculateVestedAmount = (vestingClaim: VestingClaim): string => {
  const durationInSeconds = vestingClaim.durationWeeks * 7 * 24 * 60 * 60
  const timeStampInSeconds = Math.floor(new Date().getTime() / 1000)

  // Vesting did not start yet!
  if (timeStampInSeconds < vestingClaim.startDate) {
    return "0"
  }
  const vestedSeconds = timeStampInSeconds - vestingClaim.startDate

  if (vestedSeconds >= durationInSeconds) {
    return vestingClaim.amount.toString()
  }
  if (vestingClaim.curve === LINEAR_CURVE) {
    return BigNumber.from(vestingClaim.amount)
      .mul(BigNumber.from(vestedSeconds))
      .div(BigNumber.from(durationInSeconds))
      .toString()
  }
  if (vestingClaim.curve === EXPONENTIAL_CURVE) {
    return BigNumber.from(vestingClaim.amount)
      .mul(BigNumber.from(vestedSeconds).pow(2))
      .div(BigNumber.from(durationInSeconds).pow(2))
      .toString()
  }
  throw new Error("Invalid curve type")
}
