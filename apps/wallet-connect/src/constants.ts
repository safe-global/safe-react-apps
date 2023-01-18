const { REACT_APP_WALLETCONNECT_PROJECT_ID, NODE_ENV } = process.env

export const isProduction = NODE_ENV === 'production'

export const WALLETCONNECT_V2_PROJECT_ID = REACT_APP_WALLETCONNECT_PROJECT_ID

export const SAFE_WALLET_METADATA = {
  name: 'Safe Wallet',
  description: 'The most trusted platform to manage digital assets on Ethereum',
  url: 'https://app.safe.global',
  icons: [
    'https://app.safe.global/favicons/mstile-150x150.png',
    'https://app.safe.global/favicons/logo_120x120.png',
  ],
}
