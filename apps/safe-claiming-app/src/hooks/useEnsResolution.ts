import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { ethers } from "ethers"
import { useEffect, useMemo, useState } from "react"
import { parsePrefixedAddress } from "src/utils/addresses"
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
  const [ensTimeout, setEnsTimeout] = useState<number>()
  const [ensResult, setEnsResult] = useState<ENSResult>()
  const [error, setError] = useState<string>()

  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])

  const chainPrefix = safe.chainId === 1 ? "eth" : "rin"

  useEffect(() => {
    let isMounted = true
    // we use a timeout to debounce the expensive ENS lookup
    window.clearTimeout(ensTimeout)
    setEnsTimeout(undefined)

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
      // No need to resolve via ENS
      setEnsResult({ address: ethers.utils.getAddress(customAddress) })
      setEnsLoading(false)
      setError(undefined)
      return
    }

    const resolveAddress = async () => {
      setEnsLoading(true)

      try {
        const resolvedName = await web3Provider.resolveName(customAddress)

        if (resolvedName !== null && ethers.utils.isAddress(resolvedName)) {
          isMounted &&
            setEnsResult({
              address: resolvedName,
              ens: customAddress,
            })
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
      isMounted && setEnsTimeout(undefined)
    }

    // reset error state
    setError(undefined)
    setEnsLoading(false)
    if (debounce) {
      setEnsTimeout(window.setTimeout(resolveAddress, 300))
    } else {
      resolveAddress()
    }

    return () => {
      window.clearTimeout(ensTimeout)
      setEnsTimeout(undefined)
      isMounted = false
    }
    // If we add the ensTimeout it will always trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualAddress, web3Provider])

  return [ensResult, error, ensLoading]
}
