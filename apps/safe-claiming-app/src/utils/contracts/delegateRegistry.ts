import { ethers } from "ethers"
import { Interface } from "ethers/lib/utils"
import { DelegateIDs, DelegateRegistryAddress } from "src/config/constants"

export const createDelegateTx = (delegateAddress: string, chainId: number) => {
  const delegateContractInterface = new Interface([
    "function delegation(bytes32, bytes32) public view returns (address)",
    "function setDelegate(bytes32 id, address delegate) public",
  ])
  // Add delegate tx if necessary
  const delegateId = ethers.utils.formatBytes32String(DelegateIDs[chainId])
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
