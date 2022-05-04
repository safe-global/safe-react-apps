import BigNumber from 'bignumber.js'

export const formatTokenValue = (value: number | string, decimals: number): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed()
}

export const formatCurrencyValue = (value: string, currency: string): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(value))
}
