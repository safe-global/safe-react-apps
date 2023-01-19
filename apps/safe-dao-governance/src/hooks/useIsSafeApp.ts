import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

export const useIsSafeApp = (): boolean => {
  const sdk = useSafeAppsSDK()

  return sdk.connected
}
