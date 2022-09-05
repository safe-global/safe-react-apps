import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { act } from "react-dom/test-utils"
import { usePendingTx } from "../usePendingTx"
jest.mock("@gnosis.pm/safe-apps-react-sdk", () => {
  // Workaround because mockImplementationOnce does not work properly when mocking modules?
  let mockTimes = 0
  const originalModule = jest.requireActual("@gnosis.pm/safe-apps-react-sdk")
  return {
    __esModule: true,
    // We require some of the enums/types from the original module
    ...originalModule,
    useSafeAppsSDK: () => ({
      safe: undefined,
      sdk: {
        txs: {
          getBySafeTxHash: jest
            .fn()
            .mockImplementation((safeTxHash: string) => {
              if (safeTxHash === "0x6a13e0280740cc5bd35eeee33b470b5bbb93df37") {
                return Promise.resolve({
                  txStatus:
                    mockTimes++ === 0 ? "AWAITING_EXECUTION" : "SUCCESS",
                })
              } else {
                return Promise.reject("Unknown tx!")
              }
            }),
        },
      },
    }),
  }
})

describe("usePendingTx", () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.unmock("@gnosis.pm/safe-apps-react-sdk")
  })

  it("should poll every 3 seconds and update the status", async () => {
    const { result } = renderHook(() =>
      usePendingTx("0x6a13e0280740cc5bd35eeee33b470b5bbb93df37")
    )

    expect(result.current).toBeUndefined()

    act(() => {
      jest.advanceTimersByTime(2999)
    })
    // Polling timer is not yet triggered
    expect(result.current).toBeUndefined()

    // Trigger first polling
    act(() => {
      jest.advanceTimersByTime(1)
    })

    await waitFor(() => {
      expect(result.current).toEqual("AWAITING_EXECUTION")
    })

    // Trigger second polling
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    await waitFor(() => {
      expect(result.current).toEqual("SUCCESS")
    })
  })

  it("should ignore errors", () => {
    const { result } = renderHook(() =>
      // the mock throws an error for this hash
      usePendingTx("0x6a13e0280740cc5bd35eeee33b470b5bbb93df30")
    )
    // First polling should cause error
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current).toBeUndefined()
  })

  it("should return undefined for undefined safeTxHashes", () => {
    const { result } = renderHook(() =>
      // the mock throws an error for this hash
      usePendingTx(undefined)
    )
    // First polling should return undefined
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current).toBeUndefined()
  })
})
