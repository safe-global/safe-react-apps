import { BigNumber } from "ethers"
import { VestingClaim } from "src/types/vestings"
import { createAirdropTxs } from "src/utils/contracts/airdrop"
import { createDelegateTx } from "src/utils/contracts/delegateRegistry"
import { splitAirdropAmounts } from "src/utils/splitAirdropAmounts"

export const createClaimAndDelegateTxs = (
  hasDelegateChanged: boolean,
  delegateAddress: string | undefined,
  chainId: number,
  safeAddress: string,
  isMaxAmountSelected: boolean,
  amount: string,
  userClaim: VestingClaim | null,
  investorClaim: VestingClaim | null,
  ecosystemClaim: VestingClaim | null,
  userClaimable: string,
  investorClaimable: string,
  isTokenPaused: boolean
) => {
  const txs: { to: string; value: string; data: string }[] = []

  if (!delegateAddress) return txs

  // Add delegate tx if necessary
  if (hasDelegateChanged) {
    const delegateTx = createDelegateTx(delegateAddress, chainId)
    txs.push(delegateTx)
  }

  // Create tx for userAirdrop
  const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
    isMaxAmountSelected,
    amount,
    userClaimable,
    investorClaimable
  )

  if (userClaim && BigNumber.from(userAmount).gt(0)) {
    txs.push(
      ...createAirdropTxs(
        userClaim,
        userAmount,
        safeAddress,
        userClaim.contract,
        isTokenPaused
      )
    )
  }

  if (ecosystemClaim && BigNumber.from(ecosystemAmount).gt(0)) {
    txs.push(
      ...createAirdropTxs(
        ecosystemClaim,
        ecosystemAmount,
        safeAddress,
        ecosystemClaim.contract,
        isTokenPaused
      )
    )
  }
  if (investorClaim && BigNumber.from(investorAmount).gt(0)) {
    // Investors use the VestingPool contract and can not claim if paused
    if (!isTokenPaused) {
      txs.push(
        ...createAirdropTxs(
          investorClaim,
          investorAmount,
          safeAddress,
          investorClaim.contract,
          false
        )
      )
    }
  }
  return txs
}
