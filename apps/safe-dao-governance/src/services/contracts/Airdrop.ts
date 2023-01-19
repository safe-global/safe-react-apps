import { Airdrop__factory } from '@/types/contracts/safe-token'
import type { AirdropInterface } from '@/types/contracts/safe-token/Airdrop'

export const getAirdropInterface = (): AirdropInterface => {
  return Airdrop__factory.createInterface()
}
