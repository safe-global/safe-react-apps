import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { hexZeroPad } from "ethers/lib/utils"
import { useAirdropFile } from "../useAirdropFile"

const mockSafeAddress = hexZeroPad("0x1", 20)

jest.mock("@gnosis.pm/safe-apps-react-sdk", () => {
  const originalModule = jest.requireActual("@gnosis.pm/safe-apps-react-sdk")

  const mockSafeAddress = "0x0000000000000000000000000000000000000001"
  return {
    __esModule: true,
    // We require some of the enums/types from the original module
    ...originalModule,
    useSafeAppsSDK: () => ({
      safe: { safeAddress: mockSafeAddress, chainId: 4 },
      sdk: undefined,
    }),
  }
})

describe("useAirdropFile", () => {
  it("not existing file / no airdrop", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.reject("No file found"),
      })
    ) as jest.Mock
    global.fetch = mockFetch
    const result = renderHook(() => useAirdropFile())

    await waitFor(() => {
      expect(mockFetch).toBeCalled()
      expect(result.result.current[1]).toBeFalsy()
    })
    expect(result.result.current[0]).toEqual([null, null, null])
    expect(result.result.current[2]).toBeUndefined()
  })

  it("error while fetching data", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject("Fake Server Error"),
      })
    ) as jest.Mock
    global.fetch = mockFetch
    const result = renderHook(() => useAirdropFile())

    await waitFor(() => {
      expect(mockFetch).toBeCalled()
      expect(result.result.current[1]).toBeFalsy()
    })
    expect(result.result.current[0]).toEqual([undefined, undefined, undefined])
    expect(result.result.current[2]).toEqual("Fetching vestings failed.")
  })

  it("only user vesting", async () => {
    const testVesting = [
      {
        tag: "user",
        account: mockSafeAddress,
        chainId: 4,
        contract: {},
        vestingId:
          "0xa804a5f34a15629c1aa5f41ab1c15fa257c0ea096c93bab21d34f47661e4e1b9",
        durationWeeks: 416,
        startDate: 1531562400,
        amount: "1000000000000330000000",
        curve: 0,
        proof: [
          "0xa97b6be7145e7e696a2d93b882e5565ba6c18dbf6da99561d0bd238fb254fcd6",
          "0x8dc434a2eee8e6751c87e786a00751113831be25beb2b60b91218b9c246d602c",
          "0xb2d4f520b98be9cc28b039e897682fb2e8992f1caa769757070b34223becb313",
          "0x798295a0622cf0fd36bc8e901dd9b2f3fa100d3d0de82da76c8cf8162f016142",
          "0x9b7310e00c35152648ff5bafdbb2dbc13ada1239f6a30955b91c609cee73da73",
          "0x4df827de35c4e77b19015757b1fb257a7d7d97fcbb6a51af3cf56e5b234163d0",
          "0x1573057020a0a9d5259037807489f202bac1618398ceae128e92fac195448d98",
          "0xfbf313f289be944e5c7557c7d2f55308ae7c4b328655c0eb9b740c4559764a4f",
          "0xaf2fb2695da8c1db11767b9799212e661807d42bcd41851959805a6ffe41817c",
          "0x8c31f58768f885d262078f58b2af18416213338d626fc35061fc29abec27a205",
          "0x96f0d5662e08b5e3e10a6492513290c717c5b6ea1fa564c2b11544f94fd4c1f4",
          "0xeb212b2db9fcf1fa7bdacd1835e203e9ffea10b84be2e793bd14539e999aac4f",
          "0xf727275df9c2b182f2142d51ab61a52f7b25747faf0f6dcd142de923d613eea6",
          "0xb6745866eb9a3ffb99f1fe39bf0c8a60e236e9c42bfff60431f80e0520e00486",
          "0xfe184da3981546ee7f116325cb9e4c20619398cb1b5592814a297045be298aa0",
        ],
      },
    ]
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(testVesting),
      })
    ) as jest.Mock
    global.fetch = mockFetch
    const result = renderHook(() => useAirdropFile())

    await waitFor(() => {
      expect(mockFetch).toBeCalled()
      expect(result.result.current[1]).toBeFalsy()
    })

    const vesting = result.result.current[0]
    expect(vesting).not.toBeUndefined()
    if (vesting) {
      expect(vesting).toHaveLength(3)
      expect(vesting[0]).toEqual(testVesting[0])
      expect(vesting[1]).toEqual(null)
      expect(vesting[2]).toEqual(null)
    }
  })

  it("only ecosystem vesting", async () => {
    const testVesting = [
      {
        tag: "ecosystem",
        account: mockSafeAddress,
        chainId: 4,
        contract: {},
        vestingId:
          "0xa804a5f34a15629c1aa5f41ab1c15fa257c0ea096c93bab21d34f47661e4e1b9",
        durationWeeks: 416,
        startDate: 1531562400,
        amount: "1000000000000330000000",
        curve: 0,
        proof: [
          "0xa97b6be7145e7e696a2d93b882e5565ba6c18dbf6da99561d0bd238fb254fcd6",
          "0x8dc434a2eee8e6751c87e786a00751113831be25beb2b60b91218b9c246d602c",
          "0xb2d4f520b98be9cc28b039e897682fb2e8992f1caa769757070b34223becb313",
          "0x798295a0622cf0fd36bc8e901dd9b2f3fa100d3d0de82da76c8cf8162f016142",
          "0x9b7310e00c35152648ff5bafdbb2dbc13ada1239f6a30955b91c609cee73da73",
          "0x4df827de35c4e77b19015757b1fb257a7d7d97fcbb6a51af3cf56e5b234163d0",
          "0x1573057020a0a9d5259037807489f202bac1618398ceae128e92fac195448d98",
          "0xfbf313f289be944e5c7557c7d2f55308ae7c4b328655c0eb9b740c4559764a4f",
          "0xaf2fb2695da8c1db11767b9799212e661807d42bcd41851959805a6ffe41817c",
          "0x8c31f58768f885d262078f58b2af18416213338d626fc35061fc29abec27a205",
          "0x96f0d5662e08b5e3e10a6492513290c717c5b6ea1fa564c2b11544f94fd4c1f4",
          "0xeb212b2db9fcf1fa7bdacd1835e203e9ffea10b84be2e793bd14539e999aac4f",
          "0xf727275df9c2b182f2142d51ab61a52f7b25747faf0f6dcd142de923d613eea6",
          "0xb6745866eb9a3ffb99f1fe39bf0c8a60e236e9c42bfff60431f80e0520e00486",
          "0xfe184da3981546ee7f116325cb9e4c20619398cb1b5592814a297045be298aa0",
        ],
      },
    ]
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(testVesting),
      })
    ) as jest.Mock
    global.fetch = mockFetch
    const result = renderHook(() => useAirdropFile())

    await waitFor(() => {
      expect(mockFetch).toBeCalled()
      expect(result.result.current[1]).toBeFalsy()
    })

    const vesting = result.result.current[0]
    expect(vesting).not.toBeUndefined()
    if (vesting) {
      expect(vesting).toHaveLength(3)
      expect(vesting[0]).toEqual(null)
      expect(vesting[1]).toEqual(testVesting[0])
      expect(vesting[2]).toEqual(null)
    }
  })

  it("only invesstor vesting", async () => {
    const testVesting = [
      {
        tag: "investor",
        account: mockSafeAddress,
        chainId: 4,
        contract: {},
        vestingId:
          "0xa804a5f34a15629c1aa5f41ab1c15fa257c0ea096c93bab21d34f47661e4e1b9",
        durationWeeks: 416,
        startDate: 1531562400,
        amount: "1000000000000330000000",
        curve: 0,
        proof: [
          "0xa97b6be7145e7e696a2d93b882e5565ba6c18dbf6da99561d0bd238fb254fcd6",
          "0x8dc434a2eee8e6751c87e786a00751113831be25beb2b60b91218b9c246d602c",
          "0xb2d4f520b98be9cc28b039e897682fb2e8992f1caa769757070b34223becb313",
          "0x798295a0622cf0fd36bc8e901dd9b2f3fa100d3d0de82da76c8cf8162f016142",
          "0x9b7310e00c35152648ff5bafdbb2dbc13ada1239f6a30955b91c609cee73da73",
          "0x4df827de35c4e77b19015757b1fb257a7d7d97fcbb6a51af3cf56e5b234163d0",
          "0x1573057020a0a9d5259037807489f202bac1618398ceae128e92fac195448d98",
          "0xfbf313f289be944e5c7557c7d2f55308ae7c4b328655c0eb9b740c4559764a4f",
          "0xaf2fb2695da8c1db11767b9799212e661807d42bcd41851959805a6ffe41817c",
          "0x8c31f58768f885d262078f58b2af18416213338d626fc35061fc29abec27a205",
          "0x96f0d5662e08b5e3e10a6492513290c717c5b6ea1fa564c2b11544f94fd4c1f4",
          "0xeb212b2db9fcf1fa7bdacd1835e203e9ffea10b84be2e793bd14539e999aac4f",
          "0xf727275df9c2b182f2142d51ab61a52f7b25747faf0f6dcd142de923d613eea6",
          "0xb6745866eb9a3ffb99f1fe39bf0c8a60e236e9c42bfff60431f80e0520e00486",
          "0xfe184da3981546ee7f116325cb9e4c20619398cb1b5592814a297045be298aa0",
        ],
      },
    ]
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(testVesting),
      })
    ) as jest.Mock
    global.fetch = mockFetch
    const result = renderHook(() => useAirdropFile())

    await waitFor(() => {
      expect(mockFetch).toBeCalled()
      expect(result.result.current[1]).toBeFalsy()
    })

    const vesting = result.result.current[0]
    expect(vesting).not.toBeUndefined()
    if (vesting) {
      expect(vesting).toHaveLength(3)
      expect(vesting[0]).toEqual(null)
      expect(vesting[1]).toEqual(null)
      expect(vesting[2]).toEqual(testVesting[0])
    }
  })

  it("user, ecosystem & investor vesting", async () => {
    const testVesting = [
      {
        tag: "user",
        account: mockSafeAddress,
        chainId: 4,
        contract: {},
        vestingId:
          "0xa804a5f34a15629c1aa5f41ab1c15fa257c0ea096c93bab21d34f47661e4e1b9",
        durationWeeks: 416,
        startDate: 1531562400,
        amount: "1000000000000330000000",
        curve: 0,
        proof: [
          "0xa97b6be7145e7e696a2d93b882e5565ba6c18dbf6da99561d0bd238fb254fcd6",
          "0x8dc434a2eee8e6751c87e786a00751113831be25beb2b60b91218b9c246d602c",
          "0xb2d4f520b98be9cc28b039e897682fb2e8992f1caa769757070b34223becb313",
          "0x798295a0622cf0fd36bc8e901dd9b2f3fa100d3d0de82da76c8cf8162f016142",
          "0x9b7310e00c35152648ff5bafdbb2dbc13ada1239f6a30955b91c609cee73da73",
          "0x4df827de35c4e77b19015757b1fb257a7d7d97fcbb6a51af3cf56e5b234163d0",
          "0x1573057020a0a9d5259037807489f202bac1618398ceae128e92fac195448d98",
          "0xfbf313f289be944e5c7557c7d2f55308ae7c4b328655c0eb9b740c4559764a4f",
          "0xaf2fb2695da8c1db11767b9799212e661807d42bcd41851959805a6ffe41817c",
          "0x8c31f58768f885d262078f58b2af18416213338d626fc35061fc29abec27a205",
          "0x96f0d5662e08b5e3e10a6492513290c717c5b6ea1fa564c2b11544f94fd4c1f4",
          "0xeb212b2db9fcf1fa7bdacd1835e203e9ffea10b84be2e793bd14539e999aac4f",
          "0xf727275df9c2b182f2142d51ab61a52f7b25747faf0f6dcd142de923d613eea6",
          "0xb6745866eb9a3ffb99f1fe39bf0c8a60e236e9c42bfff60431f80e0520e00486",
          "0xfe184da3981546ee7f116325cb9e4c20619398cb1b5592814a297045be298aa0",
        ],
      },
      {
        tag: "ecosystem",
        account: mockSafeAddress,
        chainId: 4,
        contract: {},
        vestingId:
          "0xa804a5f34a15629c1aa5f41ab1c15fa257c0ea096c93bab21d34f47661e4e1b9",
        durationWeeks: 416,
        startDate: 1531562400,
        amount: "1000",
        curve: 0,
        proof: [
          "0xa97b6be7145e7e696a2d93b882e5565ba6c18dbf6da99561d0bd238fb254fcd6",
          "0x8dc434a2eee8e6751c87e786a00751113831be25beb2b60b91218b9c246d602c",
          "0xb2d4f520b98be9cc28b039e897682fb2e8992f1caa769757070b34223becb313",
          "0x798295a0622cf0fd36bc8e901dd9b2f3fa100d3d0de82da76c8cf8162f016142",
          "0x9b7310e00c35152648ff5bafdbb2dbc13ada1239f6a30955b91c609cee73da73",
          "0x4df827de35c4e77b19015757b1fb257a7d7d97fcbb6a51af3cf56e5b234163d0",
          "0x1573057020a0a9d5259037807489f202bac1618398ceae128e92fac195448d98",
          "0xfbf313f289be944e5c7557c7d2f55308ae7c4b328655c0eb9b740c4559764a4f",
          "0xaf2fb2695da8c1db11767b9799212e661807d42bcd41851959805a6ffe41817c",
          "0x8c31f58768f885d262078f58b2af18416213338d626fc35061fc29abec27a205",
          "0x96f0d5662e08b5e3e10a6492513290c717c5b6ea1fa564c2b11544f94fd4c1f4",
          "0xeb212b2db9fcf1fa7bdacd1835e203e9ffea10b84be2e793bd14539e999aac4f",
          "0xf727275df9c2b182f2142d51ab61a52f7b25747faf0f6dcd142de923d613eea6",
          "0xb6745866eb9a3ffb99f1fe39bf0c8a60e236e9c42bfff60431f80e0520e00486",
          "0xfe184da3981546ee7f116325cb9e4c20619398cb1b5592814a297045be298aa0",
        ],
      },
      {
        tag: "investor",
        account: mockSafeAddress,
        chainId: 4,
        contract: {},
        vestingId:
          "0xa804a5f34a15629c1aa5f41ab1c15fa257c0ea096c93bab21d34f47661e4e1b9",
        durationWeeks: 416,
        startDate: 1531562400,
        amount: "2000",
        curve: 0,
        proof: [
          "0xa97b6be7145e7e696a2d93b882e5565ba6c18dbf6da99561d0bd238fb254fcd6",
          "0x8dc434a2eee8e6751c87e786a00751113831be25beb2b60b91218b9c246d602c",
          "0xb2d4f520b98be9cc28b039e897682fb2e8992f1caa769757070b34223becb313",
          "0x798295a0622cf0fd36bc8e901dd9b2f3fa100d3d0de82da76c8cf8162f016142",
          "0x9b7310e00c35152648ff5bafdbb2dbc13ada1239f6a30955b91c609cee73da73",
          "0x4df827de35c4e77b19015757b1fb257a7d7d97fcbb6a51af3cf56e5b234163d0",
          "0x1573057020a0a9d5259037807489f202bac1618398ceae128e92fac195448d98",
          "0xfbf313f289be944e5c7557c7d2f55308ae7c4b328655c0eb9b740c4559764a4f",
          "0xaf2fb2695da8c1db11767b9799212e661807d42bcd41851959805a6ffe41817c",
          "0x8c31f58768f885d262078f58b2af18416213338d626fc35061fc29abec27a205",
          "0x96f0d5662e08b5e3e10a6492513290c717c5b6ea1fa564c2b11544f94fd4c1f4",
          "0xeb212b2db9fcf1fa7bdacd1835e203e9ffea10b84be2e793bd14539e999aac4f",
          "0xf727275df9c2b182f2142d51ab61a52f7b25747faf0f6dcd142de923d613eea6",
          "0xb6745866eb9a3ffb99f1fe39bf0c8a60e236e9c42bfff60431f80e0520e00486",
          "0xfe184da3981546ee7f116325cb9e4c20619398cb1b5592814a297045be298aa0",
        ],
      },
    ]
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(testVesting),
      })
    ) as jest.Mock
    global.fetch = mockFetch
    const result = renderHook(() => useAirdropFile())

    await waitFor(() => {
      expect(mockFetch).toBeCalled()
      expect(result.result.current[1]).toBeFalsy()
    })

    const vesting = result.result.current[0]
    expect(vesting).not.toBeUndefined()
    if (vesting) {
      expect(vesting).toHaveLength(3)
      expect(vesting[0]).toEqual(testVesting[0])
      expect(vesting[1]).toEqual(testVesting[1])
      expect(vesting[2]).toEqual(testVesting[2])
    }
  })
})
