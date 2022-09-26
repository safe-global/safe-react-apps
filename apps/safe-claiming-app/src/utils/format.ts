export const formatAmount = (amount: number, decimals: number) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return formatter.format(amount)
}

export const shortenAddress = (address: string, length = 4): string => {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export const getExplorerURL = (address: string, chainId: string) => {
  switch (chainId) {
    case "1":
      return `https://etherscan.io/address/${address}`
    case "4":
      return `https://rinkeby.etherscan.io/address/${address}`
    default:
      return undefined
  }
}
