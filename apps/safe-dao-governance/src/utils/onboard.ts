import coinbaseModule from '@web3-onboard/coinbase'
import injectedWalletModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import trezorModule from '@web3-onboard/trezor'
import walletConnect from '@web3-onboard/walletconnect'
import tallyhoModule from '@web3-onboard/tallyho'
import type { RecommendedInjectedWallets, WalletInit } from '@web3-onboard/common/dist/types.d'
import { hexValue } from '@ethersproject/bytes'
import Onboard from '@web3-onboard/core'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

import manifestJson from '@/public/manifest.json'
import { getRpcServiceUrl } from '@/utils/web3'
import { TREZOR_APP_URL, TREZOR_EMAIL, WC_BRIDGE } from '@/config/constants'

export const enum WALLET_KEYS {
  COINBASE = 'COINBASE',
  INJECTED = 'INJECTED',
  KEYSTONE = 'KEYSTONE',
  LEDGER = 'LEDGER',
  TALLYHO = 'TALLYHO',
  TREZOR = 'TREZOR',
  WALLETCONNECT = 'WALLETCONNECT',
}

export const enum INJECTED_WALLET_KEYS {
  METAMASK = 'METAMASK',
}

const CGW_NAMES: { [key in WALLET_KEYS]: string } = {
  [WALLET_KEYS.COINBASE]: 'coinbase',
  [WALLET_KEYS.INJECTED]: 'detectedwallet',
  [WALLET_KEYS.KEYSTONE]: 'keystone',
  [WALLET_KEYS.LEDGER]: 'ledger',
  [WALLET_KEYS.TALLYHO]: 'tally',
  [WALLET_KEYS.TREZOR]: 'trezor',
  [WALLET_KEYS.WALLETCONNECT]: 'walletConnect',
}

const WALLET_MODULES: { [key in WALLET_KEYS]: () => WalletInit } = {
  [WALLET_KEYS.COINBASE]: () =>
    coinbaseModule({
      darkMode: !!window?.matchMedia('(prefers-color-scheme: dark)')?.matches,
    }),
  [WALLET_KEYS.INJECTED]: injectedWalletModule,
  [WALLET_KEYS.KEYSTONE]: keystoneModule,
  [WALLET_KEYS.LEDGER]: ledgerModule,
  [WALLET_KEYS.TALLYHO]: tallyhoModule,
  [WALLET_KEYS.TREZOR]: () => trezorModule({ appUrl: TREZOR_APP_URL, email: TREZOR_EMAIL }),
  [WALLET_KEYS.WALLETCONNECT]: () => walletConnect({ bridge: WC_BRIDGE }),
}

const getAllWallets = (): WalletInit[] => {
  return Object.values(WALLET_MODULES).map(module => module())
}

const getRecommendedInjectedWallets = (): RecommendedInjectedWallets[] => {
  return [{ name: ProviderLabel.MetaMask, url: 'https://metamask.io' }]
}

export const createOnboard = (chainConfigs: ChainInfo[]) => {
  const chains = chainConfigs.map(cfg => ({
    id: hexValue(parseInt(cfg.chainId)),
    label: cfg.chainName,
    rpcUrl: getRpcServiceUrl(cfg.rpcUri),
    token: cfg.nativeCurrency.symbol,
    color: cfg.theme.backgroundColor,
    publicRpcUrl: cfg.publicRpcUri.value,
    blockExplorerUrl: new URL(cfg.blockExplorerUriTemplate.address).origin,
  }))

  return Onboard({
    wallets: getAllWallets(),
    chains,
    accountCenter: {
      mobile: { enabled: false },
      desktop: { enabled: false },
    },
    appMetadata: {
      name: manifestJson.name,
      icon: '/images/app-logo.svg',
      description: `Please select a wallet to connect to ${manifestJson.name}`,
      recommendedInjectedWallets: getRecommendedInjectedWallets(),
    },
  })
}

const isWalletSupported = (disabledWallets: string[], walletLabel: string): boolean => {
  const legacyWalletName = CGW_NAMES[walletLabel.toUpperCase() as WALLET_KEYS]
  return !disabledWallets.includes(legacyWalletName || walletLabel)
}

export const getSupportedWallets = (chain: ChainInfo): WalletInit[] => {
  return Object.entries(WALLET_MODULES)
    .filter(([key]) => isWalletSupported(chain.disabledWallets, key))
    .map(([, module]) => module())
}
