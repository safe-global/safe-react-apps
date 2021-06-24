const networkByChainId: {
    [key in number]: string;
  } = {
    1: 'MAINNET',
    2: 'MORDEN',
    3: 'ROPSTEN',
    4: 'RINKEBY',
    5: 'GOERLI',
    42: 'KOVAN',
    100: 'XDAI',
    246: 'ENERGY_WEB_CHAIN',
    73799: 'VOLTA',
    137: 'POLYGON',

  };
  
  export { networkByChainId };
