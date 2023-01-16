import { shortenAddress } from '@/utils/addresses'

describe('addresses', () => {
  describe('shortenAddress', () => {
    it('should shorten an address', () => {
      expect(shortenAddress('0x1234567890123456789012345678901234567890')).toEqual('0x1234...7890')
    })

    it('should shorten an address with custom length', () => {
      expect(shortenAddress('0x1234567890123456789012345678901234567890', 5)).toEqual(
        '0x12345...67890',
      )
    })
  })
})
