import { formatBytes32String } from 'ethers/lib/utils'
import type { ContractTransaction } from '@ethersproject/contracts'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { DEFAULT_CHAIN_ID, CHAIN_DELEGATE_ID } from '@/config/constants'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'

export const setDelegate = async (
  provider: JsonRpcProvider,
  delegateAddress: string,
): Promise<ContractTransaction | undefined> => {
  const signer = provider.getSigner()

  let chainId: number | undefined

  try {
    chainId = await signer.getChainId()
  } catch (err) {
    console.error('Error getting chainId', err)
  }

  if (!chainId || chainId !== DEFAULT_CHAIN_ID) {
    console.error('Invalid chainId', chainId)
    return
  }

  const delegateId = CHAIN_DELEGATE_ID[chainId]

  if (!delegateId) {
    console.error('No delegateId found for chainId', chainId)
    return
  }

  const delegateRegistryContract = getDelegateRegistryContract(signer)

  let tx: ContractTransaction | undefined

  try {
    tx = await delegateRegistryContract.setDelegate(
      formatBytes32String(delegateId),
      delegateAddress,
    )
  } catch (err) {
    console.error('Error setting delegate', err)
  }

  return tx
}
