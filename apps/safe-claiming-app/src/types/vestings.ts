export type VestingData = {
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
export type VestingStatus = {
  isRedeemed: boolean
  amountClaimed: string
}

export type VestingClaim = VestingData & VestingStatus
