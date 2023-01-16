import { useEffect } from 'react'
import type { OnboardAPI } from '@web3-onboard/core'

import { ExternalStore } from '@/services/ExternalStore'
import { DEFAULT_CHAIN_ID } from '@/config/constants'
import { useChains } from '@/hooks/useChains'
import { createOnboard } from '@/utils/onboard'
import { useIsSafeApp } from '@/hooks/useIsSafeApp'

const onboardStore = new ExternalStore<OnboardAPI>()

export const useOnboard = onboardStore.useStore

export const useInitOnboard = () => {
  const { data: chains } = useChains()

  const chain = chains?.results.find(({ chainId }) => chainId === DEFAULT_CHAIN_ID.toString())
  const onboard = onboardStore.useStore()
  const isSafeApp = useIsSafeApp()

  // Create onboard instance when chains are loaded/running as dapp
  useEffect(() => {
    if (chains?.results && !isSafeApp) {
      onboardStore.setStore(createOnboard(chains.results))
    }
  }, [chains?.results, isSafeApp])

  // Disable unsupported wallets on the current chain
  useEffect(() => {
    if (!chain || isSafeApp || !onboard) {
      return
    }

    const enableWallets = async () => {
      const { getSupportedWallets } = await import('@/utils/onboard')
      const supportedWallets = getSupportedWallets(chain)
      onboard.state.actions.setWalletModules(supportedWallets)
    }

    enableWallets()
  }, [isSafeApp, onboard, chain])
}
