import { AbiItem, toBN, isAddress, fromWei } from 'web3-utils';
import abiCoder, { AbiCoder } from 'web3-eth-abi';

import { ContractInput, ContractMethod } from './hooks/useServices/interfaceRepository';

export enum CHAINS {
  MAINNET = '1',
  MORDEN = '2',
  ROPSTEN = '3',
  RINKEBY = '4',
  GOERLI = '5',
  OPTIMISM = '10',
  KOVAN = '42',
  BSC = '56',
  XDAI = '100',
  POLYGON = '137',
  ENERGY_WEB_CHAIN = '246',
  ARBITRUM = '42161',
  AVALANCHE = '43114',
  VOLTA = '73799',
  AURORA = '1313161554',
}

export const rpcUrlGetterByNetwork: {
  [key in CHAINS]: null | ((token?: string) => string);
} = {
  [CHAINS.MAINNET]: (token) => `https://mainnet.infura.io/v3/${token}`,
  [CHAINS.MORDEN]: null,
  [CHAINS.ROPSTEN]: null,
  [CHAINS.RINKEBY]: (token) => `https://rinkeby.infura.io/v3/${token}`,
  [CHAINS.GOERLI]: null,
  [CHAINS.OPTIMISM]: () => 'https://mainnet.optimism.io',
  [CHAINS.KOVAN]: null,
  [CHAINS.BSC]: () => 'https://bsc-dataseed.binance.org',
  [CHAINS.XDAI]: () => 'https://dai.poa.network',
  [CHAINS.POLYGON]: () => 'https://rpc-mainnet.matic.network',
  [CHAINS.ENERGY_WEB_CHAIN]: () => 'https://rpc.energyweb.org',
  [CHAINS.ARBITRUM]: () => 'https://arb1.arbitrum.io/rpc',
  [CHAINS.AVALANCHE]: () => 'https://api.avax.network/ext/bc/C/rpc',
  [CHAINS.VOLTA]: () => 'https://volta-rpc.energyweb.org',
  [CHAINS.AURORA]: () => 'https://mainnet.aurora.dev',
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
  const isHexValue = val?.startsWith?.('0x');
  const isNegativeValue = value < 0;

  if (isNaN(value) || isNegativeValue || isHexValue) {
    return false;
  }

  return true;
};

export const getCustomDataError = (value: string | undefined) => {
  return `Has to be a valid strict hex data${!value?.startsWith('0x') ? ' (it must start with 0x)' : ''}`;
};

export const isValidAddress = (address: string | null) => {
  if (!address) {
    return false;
  }
  return isAddress(address);
};

export const weiToEther = (wei: string) => {
  return fromWei(wei, 'ether');
};

const NON_VALID_CONTRACT_METHODS = ['receive', 'fallback'];

export const encodeToHexData = (contractMethod: ContractMethod | undefined, contractFieldsValues: any) => {
  const contractMethodName = contractMethod?.name;
  const contractFields = contractMethod?.inputs || [];

  const isValidContractMethod = contractMethodName && !NON_VALID_CONTRACT_METHODS.includes(contractMethodName);

  if (isValidContractMethod) {
    try {
      const parsedValues = contractFields.map((contractField: ContractInput, index) => {
        const contractFieldName = contractField.name || index;
        const cleanValue = contractFieldsValues[contractFieldName] || '';

        return parseInputValue(contractField, cleanValue);
      });
      const abi = abiCoder as unknown; // a bug in the web3-eth-abi types
      const hexEncondedData = (abi as AbiCoder).encodeFunctionCall(contractMethod as AbiItem, parsedValues);

      return hexEncondedData;
    } catch (error) {
      console.log('Error encoding current form values to hex data: ', error);
    }
  }
};
