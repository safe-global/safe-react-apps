import { ethers } from "ethers"
import { MAX_UINT128 } from "src/config/constants"
import { splitAirdropAmounts } from "../splitAirdropAmounts"

describe("splitAirdropAmounts", () => {
  it("should always claim max uint128 if max is selected", () => {
    const [userAmount, ecosystemAmount] = splitAirdropAmounts(
      true,
      "2000.0",
      ethers.utils.parseEther("1000").toString()
    )
    expect(userAmount).toEqual(MAX_UINT128.toString())
    expect(ecosystemAmount).toEqual(MAX_UINT128.toString())
  })

  it("should only claim from user airdrop if amount <= userClaim", () => {
    {
      const [userAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        "1.0",
        ethers.utils.parseEther("1000").toString()
      )
      expect(userAmount).toEqual(ethers.utils.parseEther("1").toString())
      expect(ecosystemAmount).toEqual("0")
    }
    {
      const [userAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        "1000.0",
        ethers.utils.parseEther("1000").toString()
      )
      expect(userAmount).toEqual(ethers.utils.parseEther("1000").toString())
      expect(ecosystemAmount).toEqual("0")
    }
  })

  it("should claim from ecosystem airdrop if amount > userClaim", () => {
    {
      const [userAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        "1000.00001",
        ethers.utils.parseEther("1000").toString()
      )
      expect(userAmount).toEqual(ethers.utils.parseEther("1000").toString())
      expect(ecosystemAmount).toEqual(
        ethers.utils.parseEther("0.00001").toString()
      )
    }
    {
      const [userAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        "2000",
        ethers.utils.parseEther("1000").toString()
      )
      expect(userAmount).toEqual(ethers.utils.parseEther("1000").toString())
      expect(ecosystemAmount).toEqual(
        ethers.utils.parseEther("1000").toString()
      )
    }
  })
})
