const COMPOUND_API_BASE_URL = 'https://api.compound.finance/api/v2/';

export async function getMarketAddressesForSafeAccount(safeAddress: string) {
  try {
    const response = await fetch(`${COMPOUND_API_BASE_URL}/governance/comp/account?address=${safeAddress}`);
    const { markets } = await response.json();
    return markets.map(({ address }: { address: string }): string => address);
  } catch (error) {
    return error;
  }
}
