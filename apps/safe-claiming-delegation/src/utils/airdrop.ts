import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

const MAX_UINT128 = BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

/**
 * Splits the amount the user wants to claim into user airdrop and ecosystem airdrop.
 * @returns userAmount in Wei, investorAmount in Wei, ecosystemAmount in Wei
 */
export const splitAirdropAmounts = (
  isMaxAmountSelected: boolean,
  amount: string,
  userAirdropClaimable: string,
  investorClaimable: string,
): [string, string, string] => {
  if (isMaxAmountSelected) {
    return [MAX_UINT128.toString(), MAX_UINT128.toString(), MAX_UINT128.toString()]
  }

  const amountInWei = parseEther(amount)

  if (amountInWei.gt(BigNumber.from(userAirdropClaimable))) {
    const leftOver = amountInWei.sub(BigNumber.from(userAirdropClaimable))

    if (leftOver.gt(BigNumber.from(investorClaimable))) {
      // We claim full user and investor airdrop + part leftOver of ecosystem
      return [
        userAirdropClaimable,
        investorClaimable,
        leftOver.sub(BigNumber.from(investorClaimable)).toString(),
      ]
    } else {
      // We claim full user + leftOver of investor airdrop
      return [userAirdropClaimable, leftOver.toString(), '0']
    }
  }

  // We just claim the user airdrop
  return [amountInWei.toString(), '0', '0']
}
