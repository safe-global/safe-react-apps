import { formatAmount, shortenAddress } from "../format"

describe("format", () => {
  describe("formatAmount", () => {
    it("should format to a fixed amount of decimals", () => {
      expect(formatAmount(0, 0)).toEqual("0")
      expect(formatAmount(0, 2)).toEqual("0.00")
      expect(formatAmount(0, 5)).toEqual("0.00000")

      expect(formatAmount(1.11111111111111, 0)).toEqual("1")
      expect(formatAmount(1.11111111111111, 2)).toEqual("1.11")
      expect(formatAmount(1.11111111111111, 5)).toEqual("1.11111")
    })

    it("should split at thousands", () => {
      expect(formatAmount(1_000, 0)).toEqual("1,000")
      expect(formatAmount(10_000, 0)).toEqual("10,000")
      expect(formatAmount(1_000_000, 0)).toEqual("1,000,000")
    })
  })
  describe("shortenAddress", () => {
    it("should shorten an address", () => {
      expect(
        shortenAddress("0x1234567890123456789012345678901234567890")
      ).toEqual("0x1234...7890")
    })

    it("should shorten an address with custom length", () => {
      expect(
        shortenAddress("0x1234567890123456789012345678901234567890", 5)
      ).toEqual("0x12345...67890")
    })
  })
})
