enum CHAINS {
  MAINNET = 1,
  RINKEBY = 4,
}

const networkByChainId: {
  [key in CHAINS]: string
} = {
  [CHAINS.MAINNET]: 'MAINNET',
  [CHAINS.RINKEBY]: 'RINKEBY',
}

export { CHAINS, networkByChainId }
