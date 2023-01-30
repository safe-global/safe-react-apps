import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk"
import { ethers } from "ethers"
import { useEffect, useMemo, useState } from "react"
import { parsePrefixedAddress, sameAddress } from "src/utils/addresses"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

type ENSResult = {
  address: string
  ens?: string
}

export const useEnsResolution = (
  manualAddress: string,
  debounce = true
): [ENSResult | undefined, string | undefined, boolean] => {
  const [ensLoading, setEnsLoading] = useState<boolean>(false)
  const [ensResult, setEnsResult] = useState<ENSResult>()
  const [error, setError] = useState<string>()

  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])

  const chainPrefix = safe.chainId === 1 ? "eth" : "rin"

  useEffect(() => {
    let isMounted = true

    if (manualAddress.length === 0) {
      setEnsResult(undefined)
      setEnsLoading(false)
      setError(undefined)
      return
    }

    const { prefix, address: customAddress } =
      parsePrefixedAddress(manualAddress)

    if (prefix && chainPrefix !== prefix) {
      setEnsResult(undefined)
      setEnsLoading(false)
      setError(`The chain prefix needs to be ${chainPrefix}:`)
      return
    }

    if (ethers.utils.isAddress(customAddress)) {
      const error = sameAddress(customAddress, safe.safeAddress)
        ? "You can't delegate to your own Safe"
        : undefined
      // No need to resolve via ENS
      setEnsResult({ address: ethers.utils.getAddress(customAddress) })
      setEnsLoading(false)
      setError(error)
      return
    }

    const resolveAddress = async () => {
      setEnsLoading(true)

      try {
        const resolvedName = await web3Provider.resolveName(customAddress)

        if (resolvedName !== null && ethers.utils.isAddress(resolvedName)) {
          if (sameAddress(resolvedName, safe.safeAddress)) {
            isMounted && setEnsResult(undefined)
            isMounted && setError("You can't delegate to your own Safe")
          } else {
            isMounted &&
              setEnsResult({
                address: resolvedName,
                ens: customAddress,
              })
          }
        } else {
          isMounted && setEnsResult(undefined)
          isMounted && setError("Invalid address / ENS name")
        }
      } catch (err) {
        console.error(err)
        isMounted && setEnsResult(undefined)
        isMounted && setError("Error while resolving ENS")
      }

      isMounted && setEnsLoading(false)
    }

    // reset error state
    setError(undefined)
    setEnsLoading(false)
    let ensTimeout: number | undefined
    if (debounce) {
      ensTimeout = window.setTimeout(resolveAddress, 300)
    } else {
      resolveAddress()
    }

    return () => {
      window.clearTimeout(ensTimeout)
      isMounted = false
    }
    // If we add the ensTimeout it will always trigger
  }, [chainPrefix, debounce, manualAddress, safe.safeAddress, web3Provider])

  return [ensResult, error, ensLoading]
}
