import { hexZeroPad, parseEther } from 'ethers/lib/utils'

import { getAirdropInterface } from '@/services/contracts/Airdrop'
import { createClaimTxs } from '@/utils/claim'
import type { Vesting } from '@/hooks/useSafeTokenAllocation'

const airdropInterface = getAirdropInterface()

describe('createClaimTxs', () => {
  const mockUserAirdropAddress = hexZeroPad('0x2', 20)
  const mockInvestorVestingAddress = hexZeroPad('0x4', 20)

  it('redeem + claim user airdrop while paused', () => {
    const safeAddress = hexZeroPad('0x5afe', 20)

    const vestingData: Vesting[] = [
      {
        isExpired: false,
        account: safeAddress,
        amount: parseEther('100').toString(),
        amountClaimed: '0',
        chainId: 5,
        contract: mockUserAirdropAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: false,
        proof: ['0x4697528f2cd5e98bce29be252b25ed33b79d8f0245bb7a3d0f00bb32e50128bb'],
        startDate: 10000,
        tag: 'user',
        vestingId: '0xabfe3d0bfb3df17a4aa39d6967f722ff82c765601417a4957434023c97d5b111',
      },
    ]

    const txs = createClaimTxs({
      vestingData,
      amount: '100',
      safeAddress,
      investorClaimable: '0',
      isMax: false,
      userClaimable: parseEther('100').toString(),
      isTokenPaused: true,
    })

    expect(txs).toHaveLength(2)

    const decodedRedeemTx = airdropInterface.decodeFunctionData('redeem', txs[0].data)
    const decodedClaimTx = airdropInterface.decodeFunctionData(
      'claimVestedTokensViaModule',
      txs[1].data,
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
    expect(decodedRedeemTx[2].toString()).toEqual('10000')
    expect(decodedRedeemTx[3].toString()).toEqual(parseEther('100').toString())

    expect(decodedClaimTx[1].toString().toLowerCase()).toEqual(safeAddress) // beneficiary
    expect(decodedClaimTx[2].toString()).toEqual(parseEther('100').toString()) // amount

    // check to address
    expect(txs[0].to.toLowerCase()).toEqual(mockUserAirdropAddress)
    expect(txs[1].to.toLowerCase()).toEqual(mockUserAirdropAddress)
  })

  it('do not claim investor airdrop while paused', () => {
    const safeAddress = hexZeroPad('0x5afe', 20)

    const vestingData: Vesting[] = [
      {
        isExpired: false,
        account: safeAddress,
        amount: parseEther('100').toString(),
        amountClaimed: '0',
        chainId: 5,
        contract: mockInvestorVestingAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: false,
        proof: ['0x4697528f2cd5e98bce29be252b25ed33b79d8f0245bb7a3d0f00bb32e50128bb'],
        startDate: 10000,
        tag: 'investor',
        vestingId: '0xabfe3d0bfb3df17a4aa39d6967f722ff82c765601417a4957434023c97d5b111',
      },
    ]

    const txs = createClaimTxs({
      vestingData,
      amount: '100',
      safeAddress,
      investorClaimable: parseEther('100').toString(),
      isMax: false,
      userClaimable: '0',
      isTokenPaused: true,
    })

    expect(txs).toHaveLength(0)
  })

  it('claim investor airdrop if unpaused', () => {
    const safeAddress = hexZeroPad('0x5afe', 20)

    const vestingData: Vesting[] = [
      {
        isExpired: false,
        account: safeAddress,
        amount: parseEther('100').toString(),
        amountClaimed: '0',
        chainId: 5,
        contract: mockInvestorVestingAddress,
        curve: 0,
        durationWeeks: 416,
        isRedeemed: true,
        proof: ['0x4697528f2cd5e98bce29be252b25ed33b79d8f0245bb7a3d0f00bb32e50128bb'],
        startDate: 10000,
        tag: 'investor',
        vestingId: '0xabfe3d0bfb3df17a4aa39d6967f722ff82c765601417a4957434023c97d5b111',
      },
    ]

    const txs = createClaimTxs({
      vestingData,
      amount: '100',
      safeAddress,
      investorClaimable: parseEther('100').toString(),
      isMax: false,
      userClaimable: '0',
      isTokenPaused: false,
    })

    expect(txs).toHaveLength(1)

    const decodedClaimTx = airdropInterface.decodeFunctionData('claimVestedTokens', txs[0].data)

    expect(decodedClaimTx[1].toString().toLowerCase()).toEqual(safeAddress) // beneficiary
    expect(decodedClaimTx[2].toString()).toEqual(parseEther('100').toString()) // amount
  })
})
