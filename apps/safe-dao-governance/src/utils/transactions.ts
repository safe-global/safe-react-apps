import type { ContractReceipt } from '@ethersproject/contracts'

export const didRevert = (receipt: ContractReceipt): boolean => {
  return receipt?.status === 0
}
