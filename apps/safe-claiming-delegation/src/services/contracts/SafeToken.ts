import { SafeToken__factory } from '@/types/contracts/safe-token'
import type { SafeTokenInterface } from '@/types/contracts/safe-token/SafeToken'

export const getSafeTokenInterface = (): SafeTokenInterface => {
  return SafeToken__factory.createInterface()
}
