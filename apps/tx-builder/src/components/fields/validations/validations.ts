import { Validate, ValidateResult } from 'react-hook-form';
import { isHexStrict } from 'web3-utils';
import { getCustomDataError, isInputValueValid, isValidAddress } from '../../../utils';
import { ADDRESS_FIELD_TYPE, AMOUNT_FIELD_TYPE, HEX_ENCODED_DATA_FIELD_TYPE } from '../constants/fields';

interface CustomValidationTypes {
  [key: string]: (value: string) => string | void;
}

const CUSTOM_VALIDATIONS: CustomValidationTypes = {
  [ADDRESS_FIELD_TYPE]: validateAddressField,
  [AMOUNT_FIELD_TYPE]: validateAmountField,
  [HEX_ENCODED_DATA_FIELD_TYPE]: validateHexEncodedDataField,
};

function validateField(fieldType: string): Validate<any> {
  return (value: string): ValidateResult => CUSTOM_VALIDATIONS[fieldType]?.(value) || undefined;
}

export default validateField;

function validateAddressField(value: string) {
  if (!isValidAddress(value)) {
    return 'Invalid Address';
  }
}

function validateAmountField(value: string) {
  if (!isInputValueValid(value)) {
    return 'Invalid Amount';
  }
}

function validateHexEncodedDataField(value: string) {
  if (!isHexStrict(value)) {
    return getCustomDataError(value);
  }
}
