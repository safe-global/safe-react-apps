import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { CHAIN_CONSTANTS } from "src/config/constants"
import useAsync, { type AsyncResult } from "src/hooks/useAsync"
import { SafeToken__factory } from "src/types/contracts/factories/SafeToken__factory"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

const getSafeBalance = (
  tokenAddress: string,
  provider: ethers.providers.Provider,
  safeAddress: string
): Promise<BigNumber> => {
  return SafeToken__factory.connect(tokenAddress, provider).balanceOf(
    safeAddress
  )
}

/**
 * Fetches the current token balance.
 */
export const useTokenBalance = (): AsyncResult<BigNumber> => {
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])
  const chainConstants = CHAIN_CONSTANTS[safe.chainId]

  return useAsync(
    () =>
      getSafeBalance(
        chainConstants.SAFE_TOKEN_ADDRESS,
        web3Provider,
        safe.safeAddress
      ),
    [safe.chainId, web3Provider, safe.safeAddress]
  )
}
