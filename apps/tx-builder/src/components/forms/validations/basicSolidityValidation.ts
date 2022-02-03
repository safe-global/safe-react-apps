import { ValidateResult } from 'react-hook-form';
import abiCoder, { AbiCoder } from 'web3-eth-abi';

import { parseInputValue } from '../../../utils';
import { NON_SOLIDITY_TYPES } from '../fields/fields';

const basicSolidityValidation = (value: string, fieldType: string): ValidateResult => {
  const isSolidityFieldType = !NON_SOLIDITY_TYPES.includes(fieldType);
  if (isSolidityFieldType) {
    try {
      const cleanValue = parseInputValue({ type: fieldType }, value);
      const abi = abiCoder as unknown; // a bug in the web3-eth-abi types
      (abi as AbiCoder).encodeParameter(fieldType, cleanValue);
    } catch (error: any) {
      return `format error. details: ${error.reason || error.toString()}`;
    }
  }
};

export default basicSolidityValidation;
