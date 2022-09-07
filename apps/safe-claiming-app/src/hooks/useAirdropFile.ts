import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { useEffect, useState } from "react"
import { VESTING_URL } from "src/config/constants"
import { VestingData } from "src/types/vestings"

export const useAirdropFile = (): [
  [VestingData | undefined | null, VestingData | undefined | null],
  boolean,
  string | undefined
] => {
  const { safe } = useSafeAppsSDK()
  const [userVesting, setUserVesting] = useState<VestingData | null>()
  const [ecosystemVesting, setEcosystemVesting] = useState<VestingData | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let isMounted = true

    const parseFile = async () => {
      try {
        setLoading(true)

        const vestingsForSafe = (
          await fetch(`${VESTING_URL}${safe.safeAddress}.json`).then(
            (response) => {
              if (response.ok) {
                return response.json() as Promise<VestingData[]>
              }
              if (response.status === 404) {
                // No file exists => the safe is not part of any vesting
                return Promise.resolve([])
              }
              throw Error(`Error fetching vestings: ${response.statusText}`)
            }
          )
        ).filter((vesting) => vesting.chainId === safe.chainId)

        isMounted &&
          setUserVesting(
            vestingsForSafe.find((vesting) => vesting.tag === "user") || null
          )
        isMounted &&
          setEcosystemVesting(
            vestingsForSafe.find((vesting) => vesting.tag === "ecosystem") ||
              null
          )
      } catch (err) {
        console.error(err)
        isMounted && setError("Fetching vestings failed.")
      } finally {
        isMounted && setLoading(false)
      }
    }

    parseFile()

    return () => {
      isMounted = false
    }
  }, [safe.chainId, safe.safeAddress])
  return [[userVesting, ecosystemVesting], loading, error]
}
