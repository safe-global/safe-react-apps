import { BigNumber } from "ethers"

const isProdEnv = process.env.NODE_ENV === "production"

type ChainConstants = {
  DELEGATE_ID: string
  SAFE_TOKEN_ADDRESS: string
}

export enum Chains {
  RINKEBY = 4,
  GOERLI = 5,
  MAINNET = 1,
}

export const STORAGE_PREFIX = "SAFE__"

export const MAX_UINT128 = BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const CLAIMING_DATA_URL = isProdEnv
  ? "https://safe-claiming-app-data.gnosis-safe.io"
  : "https://safe-claiming-app-data.staging.5afe.dev"

export const DelegateRegistryAddress =
  "0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446"

export const GUARDIANS_URL = `${CLAIMING_DATA_URL}/guardians/guardians.json`

export const GUARDIANS_IMAGE_URL = `${CLAIMING_DATA_URL}/guardians/images/`

export const VESTING_URL = `${CLAIMING_DATA_URL}/allocations/`

export const FORUM_URL = "https://forum.gnosis-safe.io"

export const DISCORD_URL = "https://discord.gg/gXK3gt8w3D"

export const GOVERNANCE_URL =
  "https://forum.gnosis-safe.io/t/how-to-safedao-governance-process/846"

export const FULL_PROPOSAL_URL =
  "https://forum.gnosis-safe.io/t/safe-voting-power-and-circulating-supply/558"

export const CHAIN_CONSTANTS: Record<number, ChainConstants> = {
  1: {
    DELEGATE_ID: "safe.eth",
    SAFE_TOKEN_ADDRESS: "0x5afe3855358e112b5647b952709e6165e1c1eeee",
  },
  4: {
    DELEGATE_ID: "tutis.eth",
    SAFE_TOKEN_ADDRESS: "0xCFf1b0FdE85C102552D1D96084AF148f478F964A",
  },
  5: {
    DELEGATE_ID: "tutis.eth",
    SAFE_TOKEN_ADDRESS: "0x61fD3b6d656F39395e32f46E2050953376c3f5Ff",
  },
}
