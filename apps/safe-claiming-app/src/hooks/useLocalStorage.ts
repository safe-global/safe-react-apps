import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { useMemo } from "react"
import Storage from "src/utils/storage/Storage"

export const useLocalStorage = () => {
  const { safe } = useSafeAppsSDK()

  const storage = useMemo(
    () => new Storage(window.localStorage, safe.safeAddress),
    [safe.safeAddress]
  )

  return storage
}
