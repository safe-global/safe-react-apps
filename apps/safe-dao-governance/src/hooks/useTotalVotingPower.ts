import { formatEther } from 'ethers/lib/utils'

import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'

export const useTotalVotingPower = (): number => {
  const { data: allocation } = useSafeTokenAllocation()

  return allocation?.votingPower ? Number(formatEther(allocation.votingPower)) : 0
}
