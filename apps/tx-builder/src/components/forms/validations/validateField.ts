import { Validate, ValidateResult } from 'react-hook-form';

import { ADDRESS_FIELD_TYPE, AMOUNT_FIELD_TYPE, HEX_ENCODED_DATA_FIELD_TYPE } from '../fields/fields';
import basicSolidityValidation from './basicSolidityValidation';
import validateAddressField from './validateAddressField';
import validateAmountField from './validateAmountField';
import validateHexEncodedDataField from './validateHexEncodedDataField';

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
