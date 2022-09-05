import { ethers, BigNumber } from "ethers"
import { MAX_UINT128 } from "src/config/constants"

/**
 * Splits the amount the user wants to claim into user airdrop and ecosystem airdrop.
 *
 * @returns userAmount in Wei, ecosystemAmount in Wei
 */
export const splitAirdropAmounts = (
  isMaxAmountSelected: boolean,
  amount: string,
  userAirdropClaimable: string
): [string, string] => {
  if (isMaxAmountSelected) {
    return [MAX_UINT128.toString(), MAX_UINT128.toString()]
  }

  const amountInWei = ethers.utils.parseEther(amount)
  if (amountInWei.gt(BigNumber.from(userAirdropClaimable))) {
    // We want to claim more than the user airdrop
    return [
      userAirdropClaimable,
      amountInWei.sub(BigNumber.from(userAirdropClaimable)).toString(),
    ]
  }
  // We just claim the user airdrop
  return [amountInWei.toString(), "0"]
}
