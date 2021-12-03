import { toBN } from 'web3-utils';

export enum CHAINS {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  BSC = 56,
  XDAI = 100,
  POLYGON = 137,
  ENERGY_WEB_CHAIN = 246,
  ARBITRUM = 42161,
  VOLTA = 73799,
}

export const rpcUrlGetterByNetwork: {
  [key in CHAINS]: null | ((token?: string) => string);
} = {
  [CHAINS.MAINNET]: (token) => `https://mainnet.infura.io/v3/${token}`,
  [CHAINS.MORDEN]: null,
  [CHAINS.ROPSTEN]: null,
  [CHAINS.RINKEBY]: (token) => `https://rinkeby.infura.io/v3/${token}`,
  [CHAINS.GOERLI]: null,
  [CHAINS.KOVAN]: null,
  [CHAINS.BSC]: () => 'https://bsc-dataseed.binance.org',
  [CHAINS.XDAI]: () => 'https://dai.poa.network',
  [CHAINS.POLYGON]: () => 'https://rpc-mainnet.matic.network',
  [CHAINS.ENERGY_WEB_CHAIN]: () => 'https://rpc.energyweb.org',
  [CHAINS.ARBITRUM]: () => 'https://arb1.arbitrum.io/rpc',
  [CHAINS.VOLTA]: () => 'https://volta-rpc.energyweb.org',
};

export const getInputHelper = (input: any) => {
  // This code renders a helper for the input text.
  if (input.type.startsWith('tuple')) {
    return `tuple(${input.components.map((c: any) => c.internalType).toString()})${
      input.type.endsWith('[]') ? '[]' : ''
    }`;
  } else {
    return input.type;
  }
};

// Same regex used for web3@1.3.6
export const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);

// This function is used to apply some parsing to some value types
export const parseInputValue = (input: any, value: string): any => {
  // If there is a match with this regular expression we get an array value like the following
  // ex: ['uint16', 'uint', '16']. If no match, null is returned
  const isNumberInput = paramTypeNumber.test(input.type);
  const isBooleanInput = input.type === 'bool';

  if (value.charAt(0) === '[') {
    return JSON.parse(value.replace(/"/g, '"'));
  }

  if (isBooleanInput) {
    return value.toLowerCase() === 'true';
  }

  if (isNumberInput && value) {
    // From web3 1.2.5 negative string numbers aren't correctly padded with leading 0's.
    // To fix that we pad the numeric values here as the encode function is expecting a string
    // more info here https://github.com/ChainSafe/web3.js/issues/3772
    const bitWidth = input.type.match(paramTypeNumber)[2];
    return toBN(value).toString(10, bitWidth);
  }

  return value;
};

export const isInputValueValid = (val: string) => {
  const value = Number(val);
  if (isNaN(value) || value < 0) {
    return false;
  }

  return true;
};
