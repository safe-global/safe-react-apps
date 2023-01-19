// Ennvironment
const IS_PULL_REQUEST = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'false'

const IS_PRODUCTION = IS_PULL_REQUEST ? false : process.env.NODE_ENV === 'production'

// General
export const LS_NAMESPACE = 'SAFE__'

export const INFURA_TOKEN = process.env.NEXT_PUBLIC_INFURA_TOKEN || ''

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Links
export const FORUM_URL = 'https://forum.safe.global'
export const GOVERNANCE_URL = 'https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846'
export const SNAPSHOT_URL = 'https://snapshot.org/#/safe.eth'
export const DISCORD_URL = 'https://chat.safe.global'

// Chains
export const Chains = {
  MAINNET: 1,
  GOERLI: 5,
}

export const DEFAULT_CHAIN_ID = IS_PRODUCTION ? Chains.MAINNET : Chains.GOERLI

// Delegation
export const CHAIN_DELEGATE_ID: Record<typeof Chains[keyof typeof Chains], string> = {
  [Chains.MAINNET]: 'safe.eth',
  [Chains.GOERLI]: 'tutis.eth',
}

export const DELEGATE_REGISTRY_ADDRESS = '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446'

const CLAIMING_DATA_URL = IS_PRODUCTION
  ? 'https://safe-claiming-app-data.gnosis-safe.io'
  : 'https://safe-claiming-app-data.staging.5afe.dev'

export const GUARDIANS_URL = `${CLAIMING_DATA_URL}/guardians/guardians.json`
export const GUARDIANS_IMAGE_URL = `${CLAIMING_DATA_URL}/guardians/images`

// Token
export const CHAIN_SAFE_TOKEN_ADDRESS: Record<typeof Chains[keyof typeof Chains], string> = {
  1: '0x5afe3855358e112b5647b952709e6165e1c1eeee',
  5: '0x61fD3b6d656F39395e32f46E2050953376c3f5Ff',
}

export const VESTING_URL = `${CLAIMING_DATA_URL}/allocations`

// Wallets
export const WC_BRIDGE = process.env.NEXT_PUBLIC_WC_BRIDGE || ''
export const TREZOR_APP_URL = 'app.safe.global'
export const TREZOR_EMAIL = 'support@safe.global'
