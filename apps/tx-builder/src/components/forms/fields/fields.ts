// based on https://docs.soliditylang.org/en/v0.8.11/abi-spec.html#types
export const ADDRESS_FIELD_TYPE = 'address';
export const BOOLEAN_FIELD_TYPE = 'bool';
export const U_INT_FIELD_TYPE = 'uint';
export const U_INT_256_FIELD_TYPE = 'uint256';
export const U_INT_32_FIELD_TYPE = 'uint32';
export const U_INT_8_FIELD_TYPE = 'uint8';
export const INT_FIELD_TYPE = 'int';
export const INT_256_FIELD_TYPE = 'int256';
export const INT_32_FIELD_TYPE = 'int32';
export const INT_8_FIELD_TYPE = 'int8';
export const BYTES_FIELD_TYPE = 'bytes';

export type SolidityFieldTypes =
  | typeof ADDRESS_FIELD_TYPE
  | typeof BOOLEAN_FIELD_TYPE
  | typeof U_INT_FIELD_TYPE
  | typeof U_INT_256_FIELD_TYPE
  | typeof U_INT_32_FIELD_TYPE
  | typeof U_INT_8_FIELD_TYPE
  | typeof INT_FIELD_TYPE
  | typeof INT_256_FIELD_TYPE
  | typeof INT_32_FIELD_TYPE
  | typeof INT_8_FIELD_TYPE
  | typeof BYTES_FIELD_TYPE;

// native token amount field
export const NATIVE_AMOUNT_FIELD_TYPE = 'nativeAmount';

// selected contract method field
export const CONTRACT_METHOD_FIELD_TYPE = 'contractMethod';

// encoded hex data field
export const CUSTOM_TRANSACTION_DATA_FIELD_TYPE = 'customTransactionData';

// text field
export const TEXT_FIELD_TYPE = 'text';

export type CustomFieldTypes =
  | typeof NATIVE_AMOUNT_FIELD_TYPE
  | typeof CONTRACT_METHOD_FIELD_TYPE
  | typeof CUSTOM_TRANSACTION_DATA_FIELD_TYPE
  | typeof TEXT_FIELD_TYPE;

export const NON_SOLIDITY_TYPES = [
  TEXT_FIELD_TYPE,
  NATIVE_AMOUNT_FIELD_TYPE,
  CONTRACT_METHOD_FIELD_TYPE,
  CUSTOM_TRANSACTION_DATA_FIELD_TYPE,
];
