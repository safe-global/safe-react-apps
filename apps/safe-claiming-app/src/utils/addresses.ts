import { getAddress, isAddress } from "ethers/lib/utils"

export type PrefixedAddress = {
  prefix?: string
  address: string
}

export const sameAddress = (address1: string, address2: string) => {
  return address1.toLowerCase() === address2.toLowerCase()
}

export const parsePrefixedAddress = (value: string): PrefixedAddress => {
  let [prefix, address] = value.split(":")

  if (!address) {
    address = value
    prefix = ""
  }

  return {
    prefix: prefix || undefined,
    address: isAddress(address) ? getAddress(address) : value,
  }
}
