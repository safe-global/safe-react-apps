import { Validate, ValidateResult } from 'react-hook-form';
import { isHexStrict } from 'web3-utils';
import abiCoder, { AbiCoder } from 'web3-eth-abi';

import { getCustomDataError, isInputValueValid, isValidAddress, parseInputValue } from '../../../utils';
import {
  ADDRESS_FIELD_TYPE,
  AMOUNT_FIELD_TYPE,
  HEX_ENCODED_DATA_FIELD_TYPE,
  NON_SOLIDITY_TYPES,
} from '../constants/fields';

type ValidationFunction = (value: string, fieldType: string) => string | undefined;

interface CustomValidationTypes {
  [key: string]: ValidationFunction[];
}

const CUSTOM_VALIDATIONS: CustomValidationTypes = {
  [ADDRESS_FIELD_TYPE]: [validateAddressField],
  [AMOUNT_FIELD_TYPE]: [validateAmountField],
  [HEX_ENCODED_DATA_FIELD_TYPE]: [validateHexEncodedDataField],
};

function validateField(fieldType: string): Validate<any> {
  return (value: string): ValidateResult =>
    [...(CUSTOM_VALIDATIONS?.[fieldType] || []), basicSolidityValidation].reduce<ValidateResult>(
      (error, validation) => {
        return error || (validation(value, fieldType) as ValidateResult);
      },
      '',
    );
}

export default validateField;

function basicSolidityValidation(value: string, fieldType: string): string | undefined {
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
}

function validateAddressField(value: string, fieldType: string): string | undefined {
  if (!isValidAddress(value)) {
    return 'Invalid Address';
  }
}

function validateAmountField(value: string, fieldType: string): string | undefined {
  if (!isInputValueValid(value)) {
    return 'Invalid Amount';
  }
}

function validateHexEncodedDataField(value: string, fieldType: string): string | undefined {
  if (!isHexStrict(value)) {
    return getCustomDataError(value);
  }
}
