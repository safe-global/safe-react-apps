const SAFE_APPS_ANALYTICS_CATEGORY = 'safe-apps-analytics'
export const NEW_SESSION_ACTION = 'New session'
export const TRANSACTION_CONFIRMED_ACTION = 'Transaction Confirmed'

export const WALLET_CONNECT_VERSION_1 = 'v1'
export const WALLET_CONNECT_VERSION_2 = 'v2'

export type WalletConnectVersion = typeof WALLET_CONNECT_VERSION_1 | typeof WALLET_CONNECT_VERSION_2

export const trackSafeAppEvent = (
  action: string,
  version: WalletConnectVersion,
  connectedPeer?: string,
) => {
  window.parent.postMessage(
    {
      category: SAFE_APPS_ANALYTICS_CATEGORY,
      action,
      label: connectedPeer,
      safeAppName: `Walletconnect-${version}`,
    },
    '*',
  )
}
