import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { ethers } from "ethers"
import {
  DelegateID,
  DelegateRegistryAddress,
  ZERO_ADDRESS,
} from "src/config/constants"
import { useEffect, useMemo, useState } from "react"
import { DelegateRegistry__factory } from "src/types/contracts"
import { getWeb3Provider } from "src/utils/getWeb3Provider"

export const useDelegate = () => {
  const [delegateAddress, setDelegateAddress] = useState<string>()
  const { sdk, safe } = useSafeAppsSDK()

  const ethersProvider = useMemo(() => getWeb3Provider(safe, sdk), [safe, sdk])

  useEffect(() => {
    let isCurrent = true

    const delegateIDInBytes = ethers.utils.formatBytes32String(DelegateID)

    const checkDelegate = async () => {
      const contractInterface = DelegateRegistry__factory.connect(
        DelegateRegistryAddress,
        ethersProvider
      )

      const address = await contractInterface.delegation(
        safe.safeAddress,
        delegateIDInBytes
      )

      if (address !== ZERO_ADDRESS) {
        isCurrent && setDelegateAddress(address)
      }
    }

    checkDelegate()

    return () => {
      isCurrent = false
    }
  }, [ethersProvider, safe.safeAddress])

  return delegateAddress
}
