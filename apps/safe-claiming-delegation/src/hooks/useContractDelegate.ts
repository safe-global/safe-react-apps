import { useQuery } from '@tanstack/react-query'
import { formatBytes32String } from 'ethers/lib/utils'
import type { JsonRpcProvider } from '@ethersproject/providers'

import { CHAIN_DELEGATE_ID, ZERO_ADDRESS } from '@/config/constants'
import { useWeb3 } from '@/hooks/useWeb3'
import { getDelegateRegistryContract } from '@/services/contracts/DelegateRegistry'
import { invalidateCache } from '@/services/QueryClient'
import { useWallet } from '@/hooks/useWallet'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

export type ContractDelegate = Pick<FileDelegate, 'address'>

export const _getContractDelegate = async (
  web3?: JsonRpcProvider,
): Promise<ContractDelegate | null> => {
  if (!web3) {
    return null
  }

  const signer = web3.getSigner()

  const chainId = await signer.getChainId()

  const delegateId = CHAIN_DELEGATE_ID[chainId]

  if (!delegateId) {
    return null
  }

  const address = await signer.getAddress()

  const delegateRegistryContract = getDelegateRegistryContract(signer)

  const delegate = await delegateRegistryContract.delegation(
    address,
    formatBytes32String(delegateId),
  )

  if (delegate === ZERO_ADDRESS) {
    return null
  }

  return {
    address: delegate,
  }
}

const QUERY_KEY = 'contractDelegate'

export const useContractDelegate = () => {
  const web3 = useWeb3()
  const wallet = useWallet()

  return useQuery({
    queryKey: [QUERY_KEY, wallet?.address, wallet?.chainId],
    queryFn: () => _getContractDelegate(web3),
    enabled: !!web3,
  })
}

export const invalidateContractDelegateCache = () => {
  invalidateCache(QUERY_KEY)
}
