const COMPOUND_API_BASE_URL = 'https://api.compound.finance/api/v2/'

export type cToken = {
  symbol: string
  token_address: string
  underlying_symbol: string
  underlying_address: string
  cash: {
    value: string
  }
}

export async function getMarketAddressesForSafeAccount(safeAddress: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${COMPOUND_API_BASE_URL}/governance/comp/account?address=${safeAddress}`,
    )
    const { markets } = await response.json()
    return markets.map(({ address }: { address: string }): string => address)
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getMarkets(): Promise<cToken[]> {
  try {
    const response = await fetch(`${COMPOUND_API_BASE_URL}/ctoken`)
    const { cToken } = await response.json()
    return cToken
  } catch (error) {
    console.error(error)
    return []
  }
}
