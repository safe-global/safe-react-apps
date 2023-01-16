export const formatAmount = (amount: number | string, decimals: number) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  const value = typeof amount === 'string' ? Number(amount) : amount

  return formatter.format(value)
}
