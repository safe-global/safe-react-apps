import { BigNumber } from "ethers"
import { AppState } from "src/App"
import { createAirdropTxs } from "src/utils/contracts/airdrop"
import { createDelegateTx } from "src/utils/contracts/delegateRegistry"
import { splitAirdropAmounts } from "src/utils/splitAirdropAmounts"
import { sameAddress } from "../addresses"

export const createClaimAndDelegateTxs = ({
  appState,
  chainId,
  safeAddress,
  isMaxAmountSelected,
  amount,
  userClaimable,
  investorClaimable,
}: {
  appState: AppState
  chainId: number
  safeAddress: string
  isMaxAmountSelected: boolean
  amount: string
  userClaimable: string
  investorClaimable: string
}) => {
  const txs: { to: string; value: string; data: string }[] = []
  const {
    delegate,
    delegateAddressFromContract,
    ecosystemClaim,
    userClaim,
    investorClaim,
    isTokenPaused,
  } = appState
  if (!delegate?.address) return txs

  // Add delegate tx if necessary
  if (
    !delegateAddressFromContract ||
    !sameAddress(delegate.address, delegateAddressFromContract)
  ) {
    const delegateTx = createDelegateTx(delegate.address, chainId)
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
