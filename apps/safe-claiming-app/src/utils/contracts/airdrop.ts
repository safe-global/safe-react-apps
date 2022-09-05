import { Airdrop__factory } from "src/types/contracts/factories/Airdrop__factory"
import { VestingClaim } from "src/types/vestings"

const createRedeemTx = (vestingClaim: VestingClaim, airdropAddress: string) => {
  const airdropInterface = Airdrop__factory.createInterface()
  const redeemTxData = airdropInterface.encodeFunctionData("redeem", [
    vestingClaim.curve,
    vestingClaim.durationWeeks,
    vestingClaim.startDate,
    vestingClaim.amount.toString(),
    vestingClaim.proof,
  ])

  return {
    to: airdropAddress,
    value: "0",
    data: redeemTxData,
  }
}

const createClaimTx = (
  vestingClaim: VestingClaim,
  amount: string,
  safeAddress: string,
  airdropAddress: string,
  isTokenPaused: boolean
) => {
  const airdropInterface = Airdrop__factory.createInterface()
  let claimData
  if (isTokenPaused) {
    claimData = airdropInterface.encodeFunctionData(
      "claimVestedTokensViaModule",
      [vestingClaim.vestingId, safeAddress, amount]
    )
  } else {
    claimData = airdropInterface.encodeFunctionData("claimVestedTokens", [
      vestingClaim.vestingId,
      safeAddress,
      amount,
    ])
  }

  return {
    to: airdropAddress,
    value: "0",
    data: claimData,
  }
}

export const createAirdropTxs = (
  vestingClaim: VestingClaim,
  amount: string,
  safeAddress: string,
  airdropAddress: string,
  isTokenPaused: boolean
) => {
  const txs: { to: string; value: string; data: string }[] = []
  // add redeem function if claiming for the first time
  if (!vestingClaim.isRedeemed) {
    const redeemTx = createRedeemTx(vestingClaim, airdropAddress)
    txs.push(redeemTx)
  }

  // add claim function
  const claimTx = createClaimTx(
    vestingClaim,
    amount,
    safeAddress,
    airdropAddress,
    isTokenPaused
  )
  txs.push(claimTx)

  return txs
}
