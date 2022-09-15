import { BigNumber } from "ethers"

type ChainConstants = {
  delegateID: string
  safeTokenAddress: string
  userAirdropAddress: string
  ecosystemAirdropAddress: string
}

export const STORAGE_PREFIX = "SAFE__"

export const MAX_UINT128 = BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const DelegateRegistryAddress =
  "0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446"

export const GUARDIANS_URL =
  "https://safe-claiming-app-data.gnosis-safe.io/guardians/guardians.json"

export const GUARDIANS_IMAGE_URL =
  "https://safe-claiming-app-data.gnosis-safe.io/guardians/images/"

export const VESTING_URL =
  "https://safe-claiming-app-data.gnosis-safe.io/allocations/"

export const FORUM_URL = "https://forum.gnosis-safe.io"

export const DISCORD_URL = "https://discord.gg/gXK3gt8w3D"

export const GOVERNANCE_URL =
  "https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846"

export const FULL_PROPOSAL_URL =
  "https://forum.gnosis-safe.io/t/safe-voting-power-and-circulating-supply/558"

export const CHAIN_CONSTANTS: Record<number, ChainConstants> = {
  1: {
    delegateID: "safe.eth",
    ecosystemAirdropAddress: "0x3eCD46C973d815e30F604619B7F3EB9B30c0e963",
    userAirdropAddress: "0x590d38Af0b484e7FB9a54a9669dcfFFB25D2DF35",
    safeTokenAddress: "0x5afe3855358e112b5647b952709e6165e1c1eeee",
  },
  4: {
    delegateID: "tutis.eth",
    ecosystemAirdropAddress: "0x82F1267759e9Bea202a46f8FC04704b6A5E2Af77",
    userAirdropAddress: "0x6C6ea0B60873255bb670F838b03db9d9a8f045c4",
    safeTokenAddress: "0xCFf1b0FdE85C102552D1D96084AF148f478F964A",
  },
}
