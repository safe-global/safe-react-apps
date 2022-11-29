const SAFE_APPS_ANALYTICS_CATEGORY = 'safe-apps-analytics'

export const WALLET_CONNECT_VERSION_1 = 'version 1'
export const WALLET_CONNECT_VERSION_2 = 'version 2'

type WalletConnectVersion = typeof WALLET_CONNECT_VERSION_1 | typeof WALLET_CONNECT_VERSION_2

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
      safeAppName: 'WalletConnect',
      eventLabel: version,
    },
    '*',
  )
}
