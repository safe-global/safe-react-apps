const SAFE_APPS_ANALYTIC_CATEGORY = 'safe-apps-analytics'

export const trackSafeAppEvent = (action: string, connectedPeer?: string) => {
  window.parent.postMessage(
    {
      category: SAFE_APPS_ANALYTIC_CATEGORY,
      action,
      label: connectedPeer,
      safeAppName: 'WalletConnect',
    },
    '*',
  )
}
