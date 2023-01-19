import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

import { splitAirdropAmounts } from '@/utils/airdrop'

export const MAX_UINT128 = BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

describe('splitAirdropAmounts', () => {
  it('should always claim max uint128 if max is selected', () => {
    const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
      true,
      '2000.0',
      parseEther('1000').toString(),
      '0',
    )
    expect(userAmount).toEqual(MAX_UINT128.toString())
    expect(investorAmount).toEqual(MAX_UINT128.toString())
    expect(ecosystemAmount).toEqual(MAX_UINT128.toString())
  })

  it('should only claim from user airdrop if amount <= userClaim', () => {
    {
      const [userAmount, , ecosystemAmount] = splitAirdropAmounts(
        false,
        '1.0',
        parseEther('1000').toString(),
        '0',
      )
      expect(userAmount).toEqual(parseEther('1').toString())
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        '1000.0',
        parseEther('1000').toString(),
        '0',
      )
      expect(userAmount).toEqual(parseEther('1000').toString())
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual('0')
    }
  })

  it('should claim from ecosystem airdrop if amount > userClaim', () => {
    {
      const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        '1000.00001',
        parseEther('1000').toString(),
        '0',
      )
      expect(userAmount).toEqual(parseEther('1000').toString())
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual(parseEther('0.00001').toString())
    }
    {
      const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        '2000',
        parseEther('1000').toString(),
        '0',
      )
      expect(userAmount).toEqual(parseEther('1000').toString())
      expect(investorAmount).toEqual('0')
      expect(ecosystemAmount).toEqual(parseEther('1000').toString())
    }
  })

  it('should claim from investor airdrop if amount >= investor allocation', () => {
    {
      const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        '1000',
        '0',
        parseEther('1000').toString(),
      )
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual(parseEther('1000').toString())
      expect(ecosystemAmount).toEqual('0')
    }
    {
      const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
        false,
        '0.002',
        '0',
        parseEther('1000').toString(),
      )
      expect(userAmount).toEqual('0')
      expect(investorAmount).toEqual(parseEther('0.002').toString())
      expect(ecosystemAmount).toEqual('0')
    }
  })

  it('should claim from user, investor and ecosystem airdrop if amount > user + investor', () => {
    const [userAmount, investorAmount, ecosystemAmount] = splitAirdropAmounts(
      false,
      '2000',
      parseEther('500').toString(),
      parseEther('1000').toString(),
    )
    expect(userAmount).toEqual(parseEther('500').toString())
    expect(investorAmount).toEqual(parseEther('1000').toString())
    expect(ecosystemAmount).toEqual(parseEther('500').toString())
  })
})
