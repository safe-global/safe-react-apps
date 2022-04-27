const TOKENS = {
  DAI: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  cDAI: '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
  BAT: '0xbf7a7169562078c96f0ec1a8afd6ae50f12e5a99',
  cBAT: '0xEBf1A11532b93a529b5bC942B4bAA98647913002',
  ETH: '0xc778417e063141139fce010982780140aa0cd5ab',
  cETH: '0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e',
  USDC: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  cUSDC: '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1',
  ZRX: '0xddea378A6dDC8AfeC82C36E9b0078826bf9e68B6',
  cZRX: '0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B',
}

const STATIC_CONFIG = [
  {
    id: 'DAI',
    label: 'DAI',
    iconUrl:
      'https://app.compound.finance/compound-components/assets/asset_DAI.svg',
    decimals: 18,
    tokenAddr: TOKENS.DAI,
    cTokenAddr: TOKENS.cDAI,
  },
  {
    id: 'BAT',
    label: 'BAT',
    iconUrl:
      'https://app.compound.finance/compound-components/assets/asset_BAT.svg',
    decimals: 18,
    tokenAddr: TOKENS.BAT,
    cTokenAddr: TOKENS.cBAT,
  },
  {
    id: 'ETH',
    label: 'ETH',
    iconUrl:
      'https://app.compound.finance/compound-components/assets/asset_ETH.svg',
    decimals: 18,
    tokenAddr: TOKENS.ETH,
    cTokenAddr: TOKENS.cETH,
  },
  {
    id: 'USDC',
    label: 'USDC',
    iconUrl:
      'https://app.compound.finance/compound-components/assets/asset_USDC.svg',
    decimals: 6,
    tokenAddr: TOKENS.USDC,
    cTokenAddr: TOKENS.cUSDC,
  },
  {
    id: 'ZRX',
    label: 'ZRX',
    iconUrl:
      'https://app.compound.finance/compound-components/assets/asset_ZRX.svg',
    decimals: 8,
    tokenAddr: TOKENS.ZRX,
    cTokenAddr: TOKENS.cZRX,
  },
]

export default STATIC_CONFIG
