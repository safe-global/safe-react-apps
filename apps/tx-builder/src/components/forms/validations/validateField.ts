import { Validate, ValidateResult } from 'react-hook-form'
import { toWei } from 'web3-utils'
import {
  ADDRESS_FIELD_TYPE,
  NATIVE_AMOUNT_FIELD_TYPE,
  BOOLEAN_FIELD_TYPE,
  CUSTOM_TRANSACTION_DATA_FIELD_TYPE,
  U_INT_FIELD_TYPE,
} from '../fields/fields'
import basicSolidityValidation from './basicSolidityValidation'
import validateAddressField from './validateAddressField'
import validateAmountField from './validateAmountField'
import validateBooleanField from './validateBooleanField'
import validateHexEncodedDataField from './validateHexEncodedDataField'

export type ValidationFunction = (value: string, fieldType: string) => ValidateResult

interface CustomValidationsType {
  [key: string]: ValidationFunction[]
}

// added this validation to the amount field, because amount values in wei are uint
const uintBasicValidation = (value: string): ValidateResult =>
  basicSolidityValidation(toWei(value), U_INT_FIELD_TYPE)

const CUSTOM_VALIDATIONS: CustomValidationsType = {
  [ADDRESS_FIELD_TYPE]: [validateAddressField],
  [CUSTOM_TRANSACTION_DATA_FIELD_TYPE]: [validateHexEncodedDataField],
  [BOOLEAN_FIELD_TYPE]: [validateBooleanField],
  [NATIVE_AMOUNT_FIELD_TYPE]: [validateAmountField, uintBasicValidation],
}

const validateField = (
  fieldType: string,
  validations: ValidationFunction[] = [],
): Validate<string> => {
  return (value: string): ValidateResult =>
    [
      ...(CUSTOM_VALIDATIONS?.[fieldType] || []),
      basicSolidityValidation,
      ...validations,
    ].reduce<ValidateResult>(
      (error, validation) => {
        return error || validation(value, fieldType)
      },
      undefined, // initially no error is present
    )
}

export default validateField
