import { isAddress, getAddress } from 'ethers/lib/utils'

export const sameAddress = (address1: string, address2: string): boolean => {
  return address1.toLowerCase() === address2.toLowerCase()
}

export const shortenAddress = (address: string, length = 4): string => {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export const parsePrefixedAddress = (value: string): { prefix?: string; address: string } => {
  let [prefix, address] = value.split(':')

  if (!address) {
    address = value
    prefix = ''
  }

  return {
    prefix: prefix || undefined,
    address: isAddress(address) ? getAddress(address) : value,
  }
}
