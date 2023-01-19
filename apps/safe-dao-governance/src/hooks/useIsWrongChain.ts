import { useIsSafeApp } from '@/hooks/useIsSafeApp'
import { useWallet } from '@/hooks/useWallet'
import { DEFAULT_CHAIN_ID } from '@/config/constants'

export const isWrongChain = (wallet: ReturnType<typeof useWallet>): boolean => {
  if (!wallet) {
    return false
  }

  return wallet.chainId !== DEFAULT_CHAIN_ID.toString()
}

export const useIsWrongChain = (): boolean => {
  const isSafeApp = useIsSafeApp()
  const wallet = useWallet()

  if (isSafeApp) {
    return false
  }

  return isWrongChain(wallet)
}
