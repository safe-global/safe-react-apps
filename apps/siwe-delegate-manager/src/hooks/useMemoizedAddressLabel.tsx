import { useMemo } from 'react'

const ADDRESS_LENGTH = 42
const CHAR_DISPLAYED = 6

const useMemoizedAddressLabel = (address: string, showFullAddress: boolean = false) => {
  const addressLabel = useMemo(() => {
    if (address && !showFullAddress) {
      const firstPart = address.slice(0, CHAR_DISPLAYED)
      const lastPart = address.slice(ADDRESS_LENGTH - CHAR_DISPLAYED)

      return `${firstPart}...${lastPart}`
    }

    return address
  }, [address, showFullAddress])

  return addressLabel
}

export default useMemoizedAddressLabel
