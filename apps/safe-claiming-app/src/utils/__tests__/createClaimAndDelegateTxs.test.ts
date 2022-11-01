import { ethers } from "ethers"
import { parseBytes32String } from "ethers/lib/utils"
import { DelegateRegistryAddress } from "src/config/constants"
import { Airdrop__factory } from "src/types/contracts"
import { createClaimAndDelegateTxs } from "../contracts/createClaimAndDelegateTxs"
import { delegateRegistryInterface } from "../contracts/delegateRegistry"

describe("createClaimAndDelegateTxs", () => {
  const mockUserAirdropAddress = ethers.utils.hexZeroPad("0x2", 20)
  const mockGuardianAirdropAddress = ethers.utils.hexZeroPad("0x3", 20)
  const mockInvestorVestingAddress = ethers.utils.hexZeroPad("0x4", 20)

  it("only delegate", () => {
    const safeAddress = ethers.utils.hexZeroPad("0x5afe", 20)
    const delegateAddress = ethers.utils.hexZeroPad("0x1", 20)
    const txs = createClaimAndDelegateTxs(
      true,
      delegateAddress,
      5,
      safeAddress,
      false,
      "0",
      {
        account: safeAddress,
        amount: "10000000000000000000",
        amountClaimed: "0",
        chainId: 5,
        contract: mockUserAirdropAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: false,
        proof: [],
        startDate: 10000,
        tag: "user",
        vestingId: "0x123",
      },
      null,
      null,
      "10000000000000000000",
      "0",
      true
    )

    expect(txs).toHaveLength(1)
    const decodedTx = delegateRegistryInterface.decodeFunctionData(
      "setDelegate",
      txs[0].data
    )
    expect(parseBytes32String(decodedTx[0])).toEqual("tutis.eth")
    expect(decodedTx[1]).toEqual(delegateAddress)
  })

  it("redeem + claim user airdrop while paused", () => {
    const safeAddress = ethers.utils.hexZeroPad("0x5afe", 20)
    const delegateAddress = ethers.utils.hexZeroPad("0x1", 20)
    const txs = createClaimAndDelegateTxs(
      false,
      delegateAddress,
      5,
      safeAddress,
      false,
      "100",
      {
        account: safeAddress,
        amount: ethers.utils.parseEther("100").toString(),
        amountClaimed: "0",
        chainId: 5,
        contract: mockUserAirdropAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: false,
        proof: [
          "0x4697528f2cd5e98bce29be252b25ed33b79d8f0245bb7a3d0f00bb32e50128bb",
        ],
        startDate: 10000,
        tag: "user",
        vestingId:
          "0xabfe3d0bfb3df17a4aa39d6967f722ff82c765601417a4957434023c97d5b111",
      },
      null,
      null,
      ethers.utils.parseEther("100").toString(),
      "0",
      true
    )

    expect(txs).toHaveLength(2)
    const airdropInterface = Airdrop__factory.createInterface()
    const decodedRedeemTx = airdropInterface.decodeFunctionData(
      "redeem",
      txs[0].data
    )
    const decodedClaimTx = airdropInterface.decodeFunctionData(
      "claimVestedTokensViaModule",
      txs[1].data
    )
    /*
        uint8 curveType,
        uint16 durationWeeks,
        uint64 startDate,
        uint128 amount,
        bytes32[] calldata proof
    */
    expect(decodedRedeemTx[0]).toEqual(0)
    expect(decodedRedeemTx[1]).toEqual(416)
    expect(decodedRedeemTx[2].toString()).toEqual("10000")
    expect(decodedRedeemTx[3].toString()).toEqual(
      ethers.utils.parseEther("100").toString()
    )

    expect(decodedClaimTx[1].toString().toLowerCase()).toEqual(safeAddress) // beneficiary
    expect(decodedClaimTx[2].toString()).toEqual(
      ethers.utils.parseEther("100").toString()
    ) // amount

    // check to address
    expect(txs[0].to.toLowerCase()).toEqual(mockUserAirdropAddress)
    expect(txs[1].to.toLowerCase()).toEqual(mockUserAirdropAddress)
  })

  it("do not claim investor airdrop while paused", () => {
    const safeAddress = ethers.utils.hexZeroPad("0x5afe", 20)
    const delegateAddress = ethers.utils.hexZeroPad("0x1", 20)
    const txs = createClaimAndDelegateTxs(
      false,
      delegateAddress,
      5,
      safeAddress,
      false,
      "100",
      null,
      {
        account: safeAddress,
        amount: ethers.utils.parseEther("100").toString(),
        amountClaimed: "0",
        chainId: 5,
        contract: mockInvestorVestingAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: true,
        proof: [
          "0x4697528f2cd5e98bce29be252b25ed33b79d8f0245bb7a3d0f00bb32e50128bb",
        ],
        startDate: 10000,
        tag: "investor",
        vestingId:
          "0xabfe3d0bfb3df17a4aa39d6967f722ff82c765601417a4957434023c97d5b111",
      },
      null,
      ethers.utils.parseEther("100").toString(),
      "0",
      true
    )

    expect(txs).toHaveLength(0)
  })

  it("claim investor airdrop if unpaused", () => {
    const safeAddress = ethers.utils.hexZeroPad("0x5afe", 20)
    const delegateAddress = ethers.utils.hexZeroPad("0x1", 20)
    const txs = createClaimAndDelegateTxs(
      false,
      delegateAddress,
      5,
      safeAddress,
      false,
      "100",
      null,
      {
        account: safeAddress,
        amount: ethers.utils.parseEther("100").toString(),
        amountClaimed: "0",
        chainId: 5,
        contract: mockInvestorVestingAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: true,
        proof: [
          "0x4697528f2cd5e98bce29be252b25ed33b79d8f0245bb7a3d0f00bb32e50128bb",
        ],
        startDate: 10000,
        tag: "investor",
        vestingId:
          "0xabfe3d0bfb3df17a4aa39d6967f722ff82c765601417a4957434023c97d5b111",
      },
      null,
      "0",
      ethers.utils.parseEther("100").toString(),
      false
    )

    expect(txs).toHaveLength(1)
    const airdropInterface = Airdrop__factory.createInterface()
    const decodedClaimTx = airdropInterface.decodeFunctionData(
      "claimVestedTokens",
      txs[0].data
    )
    expect(decodedClaimTx[1].toString().toLowerCase()).toEqual(safeAddress) // beneficiary
    expect(decodedClaimTx[2].toString()).toEqual(
      ethers.utils.parseEther("100").toString()
    ) // amount
  })
})
