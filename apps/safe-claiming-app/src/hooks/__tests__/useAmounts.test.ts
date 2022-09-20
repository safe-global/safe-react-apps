import { renderHook } from "@testing-library/react-hooks"
import { ethers } from "ethers"
import { act } from "react-dom/test-utils"
import { VestingClaim } from "src/types/vestings"
import { useAmounts } from "../useAmounts"
import * as web3 from "src/utils/getWeb3Provider"
import { waitFor } from "@testing-library/react"

const fakeNow = new Date()

const ONE_WEEK = 7 * 24 * 60 * 60

const SAFE_ADDRESS = "0x6a13e0280740cc5bd35eeee33b470b5bbb93df37"

jest.mock("@gnosis.pm/safe-apps-react-sdk", () => {
  const originalModule = jest.requireActual("@gnosis.pm/safe-apps-react-sdk")
  return {
    __esModule: true,
    // We require some of the enums/types from the original module
    ...originalModule,
    useSafeAppsSDK: () => ({
      safe: {
        safeAddress: "0x6a13E0280740CC5bd35eeee33B470b5bBb93dF37",
        chainId: 4,
      },
      sdk: undefined,
    }),
  }
})

const createMockVesting = (
  durationWeeks: number,
  amount: number,
  vestingStartDiffInWeeks: number,
  claimedAmount?: number
): VestingClaim => {
  return {
    proof: [],
    isRedeemed: false,
    amountClaimed: claimedAmount
      ? ethers.utils.parseEther(claimedAmount.toString()).toString()
      : "0",
    vestingId: "0x01",
    account: ethers.utils.hexZeroPad("0x1", 20),
    amount: ethers.utils.parseEther(amount.toString()).toString(),
    curve: 0,
    durationWeeks,
    chainId: 4,
    contract: ethers.utils.hexZeroPad("0x2", 20),
    tag: "user",
    startDate:
      Math.floor(fakeNow.getTime() / 1000) + ONE_WEEK * vestingStartDiffInWeeks,
  }
}

describe("useAmounts()", () => {
  let mockBlock: jest.Mock
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    mockBlock = jest.fn()
    jest.spyOn(web3, "getWeb3Provider").mockImplementation(
      () =>
        ({
          getBlock: mockBlock,
        } as any)
    )
    mockBlock.mockImplementationOnce(() =>
      Promise.resolve({
        timestamp: Math.floor(fakeNow.getTime() / 1000),
      })
    )
  })

  it("should return 0 without vesting claim", () => {
    const result = renderHook(() => useAmounts(null))
    expect(result.result.current).toEqual(["0", "0"])
  })

  it("fully vested amount", async () => {
    const vestingClaim: VestingClaim = createMockVesting(1, 1000, -1)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("1000").toString(),
        "0",
      ])
    })
  })

  it("vesting did not start yet", async () => {
    const vestingClaim: VestingClaim = createMockVesting(1, 1000, 1)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        "0",
        ethers.utils.parseEther("1000").toString(),
      ])
    })
  })

  it("vesting fully vested and fully claimed", async () => {
    const vestingClaim: VestingClaim = createMockVesting(1, 1000, -1, 1000)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("0").toString(),
        "0",
      ])
    })
  })

  it("vesting fully vested and partly claimed", async () => {
    const vestingClaim: VestingClaim = createMockVesting(1, 1000, -1, 500)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("500").toString(),
        "0",
      ])
    })
  })

  it("vesting half vested", async () => {
    const vestingClaim: VestingClaim = createMockVesting(2, 1000, -1)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("500").toString(),
        ethers.utils.parseEther("500").toString(),
      ])
    })
  })

  it("vesting half vested and quarter claimed", async () => {
    const vestingClaim: VestingClaim = createMockVesting(2, 1000, -1, 250)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("250").toString(),
        ethers.utils.parseEther("500").toString(),
      ])
    })
  })

  it("vesting half vested and quarter claimed", async () => {
    const vestingClaim: VestingClaim = createMockVesting(2, 1000, -1, 250)
    const result = renderHook(() => useAmounts(vestingClaim))
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("250").toString(),
        ethers.utils.parseEther("500").toString(),
      ])
    })
  })

  it("test polling and updating of vesting", async () => {
    // vests 1 token per second
    const vestingClaim = createMockVesting(1, ONE_WEEK, 0)
    const result = renderHook(() => useAmounts(vestingClaim))
    // Initially nothing is vested and 1000 are in vesting
    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("0").toString(),
        ethers.utils.parseEther(ONE_WEEK.toString()).toString(),
      ])
    })

    // mock new block-timestamp
    mockBlock.mockImplementation(() =>
      Promise.resolve({
        timestamp: Math.floor(fakeNow.getTime() / 1000) + 10,
      })
    )

    // advance to next polling
    act(() => {
      jest.advanceTimersByTime(10_000)
    })

    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("10").toString(),
        ethers.utils.parseEther((ONE_WEEK - 10).toString()).toString(),
      ])
    })

    mockBlock.mockImplementation(() =>
      Promise.resolve({
        timestamp: Math.floor(fakeNow.getTime() / 1000) + 100,
      })
    )
    // Poll 9 more times
    act(() => {
      jest.advanceTimersByTime(90_000)
    })

    await waitFor(() => {
      expect(result.result.current).toEqual([
        ethers.utils.parseEther("100").toString(),
        ethers.utils.parseEther((ONE_WEEK - 100).toString()).toString(),
      ])
    })
  })
})
