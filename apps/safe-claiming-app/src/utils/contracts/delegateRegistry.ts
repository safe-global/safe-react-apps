import { ethers } from "ethers"
import { DelegateID, DelegateRegistryAddress } from "src/config/constants"
import { DelegateRegistry__factory } from "src/types/contracts"

export const createDelegateTx = (delegateAddress: string) => {
  // Add delegate tx if necessary
  const delegateContractInterface = DelegateRegistry__factory.createInterface()
  const delegateId = ethers.utils.formatBytes32String(DelegateID)
  const delegateData = delegateContractInterface.encodeFunctionData(
    "setDelegate",
    [delegateId, delegateAddress]
  )

  return {
    to: DelegateRegistryAddress,
    value: "0",
    data: delegateData,
  }
}
