import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { useEffect, useMemo, useState } from "react"
import { ZERO_ADDRESS } from "src/config/constants"
import { Airdrop__factory } from "src/types/contracts/factories/Airdrop__factory"
import { VestingStatus } from "src/types/vestings"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

export const useFetchVestingStatus = (
  vestingId: string | undefined,
  airdropAddress: string,
  lastClaimTimestamp: number
) => {
  const { safe, sdk } = useSafeAppsSDK()
  const web3Provider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])
  const [vestingStatus, setVestingStatus] = useState<VestingStatus>()

  useEffect(() => {
    let isMounted = true
    const fetchVestingStatus = async () => {
      if (!vestingId) {
        return
      }
      try {
        // Check if vesting is already redeemed and amount claimed
        const newVesting = await Airdrop__factory.connect(
          airdropAddress,
          web3Provider
        ).vestings(vestingId)

        if (newVesting.account.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
          isMounted &&
            setVestingStatus({
              isRedeemed: false,
              amountClaimed: "0",
            })
        } else {
          isMounted &&
            setVestingStatus({
              amountClaimed: newVesting.amountClaimed.toString(),
              isRedeemed: true,
            })
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchVestingStatus()

    return () => {
      isMounted = false
    }
  }, [airdropAddress, vestingId, web3Provider, lastClaimTimestamp])

  return vestingStatus
}
