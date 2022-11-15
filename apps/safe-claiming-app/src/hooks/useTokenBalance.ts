import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { BigNumber } from "ethers"
import { useEffect, useMemo, useState } from "react"
import { CHAIN_CONSTANTS } from "src/config/constants"
import { SafeToken__factory } from "src/types/contracts/factories/SafeToken__factory"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

/**
 * Fetches the current token balance.
 */
export const useTokenBalance = () => {
  const [balance, setBalance] = useState(BigNumber.from(0))
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])
  const chainConstants = CHAIN_CONSTANTS[safe.chainId]

  useEffect(() => {
    let isMounted = true

    const fetchTokenBalance = async () => {
      try {
        const newBalance = await SafeToken__factory.connect(
          chainConstants.SAFE_TOKEN_ADDRESS,
          web3Provider
        ).balanceOf(safe.safeAddress)

        isMounted && setBalance(newBalance)
      } catch (error) {
        console.error(error)
      }
    }
    if (chainConstants) {
      fetchTokenBalance()
    }
    return () => {
      isMounted = false
    }
  }, [chainConstants, safe.safeAddress, web3Provider])

  return balance
}
