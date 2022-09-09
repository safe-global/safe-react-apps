import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { useEffect, useState } from "react"
import { SAFE_TOKEN_ADDRESSES } from "src/config/constants"
import { SafeToken__factory } from "src/types/contracts/factories/SafeToken__factory"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

/**
 * Fetches if the token is currently paused from on-chain.
 * If the fetching fails and initially we assume that the token is paused as the claimingViaModule should always work.
 */
export const useIsTokenPaused = () => {
  const [isPaused, setIsPaused] = useState(true)
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = getWeb3Provider(safe, sdk)

  useEffect(() => {
    let isMounted = true

    const fetchIsTokenPaused = async () => {
      try {
        const paused = await SafeToken__factory.connect(
          SAFE_TOKEN_ADDRESSES[safe.chainId],
          web3Provider
        ).paused()

        isMounted && setIsPaused(paused)
      } catch (error) {
        console.error(error)
      }
    }

    fetchIsTokenPaused()
    return () => {
      isMounted = false
    }
  }, [web3Provider])

  return isPaused
}
