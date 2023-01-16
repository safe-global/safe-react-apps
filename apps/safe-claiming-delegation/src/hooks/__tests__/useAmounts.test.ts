import { act, renderHook } from '@/tests/test-utils'
import { parseEther, hexZeroPad } from 'ethers/lib/utils'

import { DESYNC_BUFFER } from '@/utils/vesting'
import { useAmounts } from '@/hooks/useAmounts'
import type { Vesting } from '@/hooks/useSafeTokenAllocation'

const fakeNow = new Date()

const ONE_WEEK = 7 * 24 * 60 * 60

const createMockVesting = (
  durationWeeks: number,
  amount: number,
  vestingStartDiffInWeeks: number,
  claimedAmount?: number,
): Vesting => {
  return {
    proof: [],
    isRedeemed: false,
    amountClaimed: claimedAmount ? parseEther(claimedAmount.toString()).toString() : '0',
    vestingId: '0x01',
    account: hexZeroPad('0x1', 20),
    amount: parseEther(amount.toString()).toString(),
    curve: 0,
    durationWeeks,
    chainId: 4,
    contract: hexZeroPad('0x2', 20),
    tag: 'user',
    startDate:
      Math.floor(fakeNow.getTime() / 1000) - DESYNC_BUFFER + ONE_WEEK * vestingStartDiffInWeeks,
    isExpired: false,
  }
}

describe('useAmounts', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.setSystemTime(fakeNow)
  })
  it('should return 0 without vesting claim', () => {
    const result = renderHook(() => useAmounts(null))
    expect(result.result.current).toEqual(['0', '0'])
  })

  it('fully vested amount', () => {
    const vestingClaim = createMockVesting(1, 1000, -1)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual([parseEther('1000').toString(), '0'])
  })

  it('vested amount is smaller than amount claimed', () => {
    // vesting is just half vested but already more than half is claimed (10 more than half)
    const vestingClaim = createMockVesting(2, 1000, -1, 510)
    const result = renderHook(() => useAmounts(vestingClaim))
    // nothing is claimable and 490 are in vesting
    expect(result.result.current).toEqual([
      parseEther('0').toString(),
      parseEther('490').toString(),
    ])
  })

  it('vesting did not start yet', () => {
    const vestingClaim = createMockVesting(1, 1000, 1)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual(['0', parseEther('1000').toString()])
  })

  it('vesting fully vested and fully claimed', () => {
    const vestingClaim = createMockVesting(1, 1000, -1, 1000)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual([parseEther('0').toString(), '0'])
  })

  it('vesting fully vested and partly claimed', () => {
    const vestingClaim = createMockVesting(1, 1000, -1, 500)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual([parseEther('500').toString(), '0'])
  })

  it('vesting half vested', () => {
    const vestingClaim = createMockVesting(2, 1000, -1)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual([
      parseEther('500').toString(),
      parseEther('500').toString(),
    ])
  })

  it('vesting half vested and quarter claimed', () => {
    const vestingClaim = createMockVesting(2, 1000, -1, 250)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual([
      parseEther('250').toString(),
      parseEther('500').toString(),
    ])
  })

  it('vesting half vested and quarter claimed', () => {
    const vestingClaim = createMockVesting(2, 1000, -1, 250)
    const result = renderHook(() => useAmounts(vestingClaim))
    expect(result.result.current).toEqual([
      parseEther('250').toString(),
      parseEther('500').toString(),
    ])
  })

  it('test polling and updating of vesting', () => {
    // vests 1 token per second
    const vestingClaim = createMockVesting(1, ONE_WEEK, 0)
    const result = renderHook(() => useAmounts(vestingClaim))
    // Initially nothing is vested and 1000 are in vesting
    expect(result.result.current).toEqual([
      parseEther('0').toString(),
      parseEther(ONE_WEEK.toString()).toString(),
    ])

    // advance to next polling
    act(() => {
      jest.advanceTimersByTime(10_000)
    })

    expect(result.result.current).toEqual([
      parseEther('10').toString(),
      parseEther((ONE_WEEK - 10).toString()).toString(),
    ])

    // Poll 9 more times
    act(() => {
      jest.advanceTimersByTime(90_000)
    })

    expect(result.result.current).toEqual([
      parseEther('100').toString(),
      parseEther((ONE_WEEK - 100).toString()).toString(),
    ])
  })
})
