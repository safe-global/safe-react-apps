import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { useEffect, useState } from "react"
import { CHAIN_CONSTANTS } from "src/config/constants"
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
  const chainConstants = CHAIN_CONSTANTS[safe.chainId]

  useEffect(() => {
    let isMounted = true

    const fetchIsTokenPaused = async () => {
      try {
        const paused = await SafeToken__factory.connect(
          chainConstants.safeTokenAddress,
          web3Provider
        ).paused()

        isMounted && setIsPaused(paused)
      } catch (error) {
        console.error(error)
      }
    }
    if (chainConstants) {
      fetchIsTokenPaused()
    }
    return () => {
      isMounted = false
    }
  }, [chainConstants, web3Provider])

  return isPaused
}
