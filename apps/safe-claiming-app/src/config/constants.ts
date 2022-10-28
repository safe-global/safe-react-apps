import { BigNumber } from "ethers"

type ChainConstants = {
  DELEGATE_ID: string
  SAFE_TOKEN_ADDRESS: string
  USER_AIRDROP_ADDRESS: string
  ECOSYSTEM_AIRDROP_ADDRESS: string
  INVESTOR_AIRDROP_ADDRESS: string
}

export enum Chains {
  RINKEBY = 4,
  MAINNET = 1,
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
  "https://safe-claiming-app-data.staging.5afe.dev/allocations/"

export const FORUM_URL = "https://forum.gnosis-safe.io"

export const DISCORD_URL = "https://discord.gg/gXK3gt8w3D"

export const GOVERNANCE_URL =
  "https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846"

export const FULL_PROPOSAL_URL =
  "https://forum.gnosis-safe.io/t/safe-voting-power-and-circulating-supply/558"

export const CHAIN_CONSTANTS: Record<number, ChainConstants> = {
  1: {
    DELEGATE_ID: "safe.eth",
    ECOSYSTEM_AIRDROP_ADDRESS: "0x29067F28306419923BCfF96E37F95E0f58ABdBBe",
    USER_AIRDROP_ADDRESS: "0xA0b937D5c8E32a80E3a8ed4227CD020221544ee6",
    SAFE_TOKEN_ADDRESS: "0x5afe3855358e112b5647b952709e6165e1c1eeee",
    INVESTOR_AIRDROP_ADDRESS: "0x96B71e2551915d98d22c448b040A3BC4801eA4ff",
  },
  4: {
    DELEGATE_ID: "tutis.eth",
    ECOSYSTEM_AIRDROP_ADDRESS: "0x82F1267759e9Bea202a46f8FC04704b6A5E2Af77",
    USER_AIRDROP_ADDRESS: "0x6C6ea0B60873255bb670F838b03db9d9a8f045c4",
    SAFE_TOKEN_ADDRESS: "0xCFf1b0FdE85C102552D1D96084AF148f478F964A",
    INVESTOR_AIRDROP_ADDRESS: "TODO",
  },
}
