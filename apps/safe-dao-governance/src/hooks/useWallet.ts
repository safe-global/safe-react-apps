import { useEffect, useState } from 'react'
import { getAddress } from 'ethers/lib/utils'
import type { EIP1193Provider, WalletState } from '@web3-onboard/core'

import { useOnboard } from '@/hooks/useOnboard'
import { localItem } from '@/services/storage/local'
import { isWalletUnlocked } from '@/utils/wallet'

export type ConnectedWallet = {
  label: string
  chainId: string
  address: string
  ens?: string
  provider: EIP1193Provider
}

// Get the most recently connected wallet address
export const getConnectedWallet = (wallets: WalletState[]): ConnectedWallet | null => {
  if (!wallets) {
    return null
  }

  const primaryWallet = wallets[0]
  if (!primaryWallet) {
    return null
  }

  const account = primaryWallet?.accounts[0]
  if (!account) {
    return null
  }

  return {
    label: primaryWallet.label,
    address: getAddress(account.address),
    ens: account.ens?.name,
    chainId: Number(primaryWallet.chains[0].id).toString(10),
    provider: primaryWallet.provider,
  }
}

export const useWallet = (): ConnectedWallet | null => {
  const onboard = useOnboard()
  const onboardWallets = onboard?.state.get().wallets || []
  const [wallet, setWallet] = useState<ConnectedWallet | null>(getConnectedWallet(onboardWallets))

  useEffect(() => {
    if (!onboard) {
      return
    }

    const walletSubscription = onboard.state.select('wallets').subscribe(wallets => {
      const newWallet = getConnectedWallet(wallets)
      setWallet(newWallet)
    })

    return () => {
      walletSubscription.unsubscribe()
    }
  }, [onboard])

  return wallet
}

const LAST_WALLET_KEY = 'lastWallet'
const lastWalletStorage = localItem<string>(LAST_WALLET_KEY)

export const useInitWallet = () => {
  const onboard = useOnboard()

  // Connect to previously connected wallet
  useEffect(() => {
    if (!onboard) {
      return
    }

    const walletSubscription = onboard.state.select('wallets').subscribe(wallets => {
      const newWallet = getConnectedWallet(wallets)
      if (newWallet) {
        lastWalletStorage.set(newWallet.label)
      } else {
        lastWalletStorage.remove()
      }
    })

    return () => {
      walletSubscription.unsubscribe()
    }
  }, [onboard])

  useEffect(() => {
    if (!onboard) {
      return
    }

    const label = lastWalletStorage.get()

    if (!label) {
      return
    }

    isWalletUnlocked(label).then(isUnlocked => {
      if (isUnlocked) {
        onboard.connectWallet({
          autoSelect: { label, disableModals: true },
        })
      }
    })
  }, [onboard])
}
