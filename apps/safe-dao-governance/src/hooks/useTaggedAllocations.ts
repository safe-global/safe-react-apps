import { BigNumber } from 'ethers'

import { useAmounts } from '@/hooks/useAmounts'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { getVestingTypes } from '@/utils/vesting'

const getTotal = (...amounts: string[]) => {
  const [amount, ...rest] = amounts
  const total = rest.reduce((acc, amount) => {
    return acc.add(BigNumber.from(amount))
  }, BigNumber.from(amount))

  return total.toString()
}

export const useTaggedAllocations = (): {
  user: {
    claimable: string
    inVesting: string
  }
  ecosystem: {
    claimable: string
    inVesting: string
  }
  investor: {
    claimable: string
    inVesting: string
  }
  total: {
    claimable: string
    inVesting: string
    allocation: string
  }
} => {
  const { data: allocation } = useSafeTokenAllocation()

  // Get vesting types
  const { userVesting, ecosystemVesting, investorVesting } = getVestingTypes(
    allocation?.vestingData || [],
  )

  // Calculate claimable vs. vested amounts for each vesting type
  const [userClaimable, userInVesting] = useAmounts(userVesting)
  const [ecosystemClaimable, ecosystemInVesting] = useAmounts(ecosystemVesting)
  const [investorClaimable, investorInVesting] = useAmounts(investorVesting)

  // Calculate total of claimable vs. vested amounts
  const totalAmountClaimable = getTotal(userClaimable, ecosystemClaimable, investorClaimable)

  const totalAmountInVesting = getTotal(userInVesting, ecosystemInVesting, investorInVesting)

  const totalAllocation = getTotal(
    userVesting?.amount || '0',
    ecosystemVesting?.amount || '0',
    investorVesting?.amount || '0',
  )

  return {
    user: {
      claimable: userClaimable,
      inVesting: userInVesting,
    },
    ecosystem: {
      claimable: ecosystemClaimable,
      inVesting: ecosystemInVesting,
    },
    investor: {
      claimable: investorClaimable,
      inVesting: investorInVesting,
    },
    total: {
      claimable: totalAmountClaimable,
      inVesting: totalAmountInVesting,
      allocation: totalAllocation,
    },
  }
}
