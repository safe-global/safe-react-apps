import { sameAddress } from '@/utils/addresses'
import { useContractDelegate } from '@/hooks/useContractDelegate'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import type { ContractDelegate } from '@/hooks/useContractDelegate'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

export type Delegate = FileDelegate | ContractDelegate

export const useDelegate = (): Delegate | null => {
  const { data: delegatesFile } = useDelegatesFile()
  const { data: contractDelegate } = useContractDelegate()

  if (!delegatesFile || !contractDelegate) {
    return null
  }

  const delegate = delegatesFile.find(delegate => {
    return sameAddress(delegate.address, contractDelegate.address)
  })

  return delegate || contractDelegate
}
