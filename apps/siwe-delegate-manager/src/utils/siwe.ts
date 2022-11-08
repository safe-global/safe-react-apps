import { keccak256 } from 'ethers/lib/utils'
import { toUtf8Bytes } from '@ethersproject/strings'

const getSiWeSpaceId = (delegateAddress: string): string =>
  keccak256(toUtf8Bytes(`siwe${delegateAddress}`))

export { getSiWeSpaceId }
