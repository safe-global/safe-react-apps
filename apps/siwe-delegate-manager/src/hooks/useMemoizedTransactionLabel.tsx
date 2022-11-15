import { useMemo } from 'react'

const TRANSACTION_HASH_LENGTH = 66
const CHAR_DISPLAYED = 10

const useMemoizedTransactionLabel = (address: string, showFullAddress: boolean = false) => {
  const addressLabel = useMemo(() => {
    if (address && !showFullAddress) {
      const firstPart = address.slice(0, CHAR_DISPLAYED)
      const lastPart = address.slice(TRANSACTION_HASH_LENGTH - CHAR_DISPLAYED)

      return `${firstPart}...${lastPart}`
    }

    return address
  }, [address, showFullAddress])

  return addressLabel
}

export default useMemoizedTransactionLabel
