import SafeAppsSDK, { SafeInfo } from "@safe-global/safe-apps-sdk"
import { SafeAppProvider } from "@safe-global/safe-apps-provider"
import { ethers } from "ethers"

export const getWeb3Provider = (
  safe: SafeInfo,
  sdk: SafeAppsSDK
): ethers.providers.Provider => {
  const safeAppProvider = new SafeAppProvider(safe, sdk)
  return new ethers.providers.Web3Provider(safeAppProvider)
}
