// based on https://docs.soliditylang.org/en/v0.8.11/abi-spec.html#types
export const ADDRESS_FIELD_TYPE = 'address';
export const BOOLEAN_FIELD_TYPE = 'bool';

// native token field
export const AMOUNT_FIELD_TYPE = 'uint';

// selected contract method field
export const CONTRACT_METHOD_FIELD_TYPE = 'contractMethod';

// encoded hex data field
export const HEX_ENCODED_DATA_FIELD_TYPE = 'hexEncodedData';

export const NON_SOLIDITY_TYPES = [CONTRACT_METHOD_FIELD_TYPE, HEX_ENCODED_DATA_FIELD_TYPE];
