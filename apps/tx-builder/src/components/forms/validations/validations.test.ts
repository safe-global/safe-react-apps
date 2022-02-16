import {
  ADDRESS_FIELD_TYPE,
  BOOLEAN_FIELD_TYPE,
  U_INT_256_FIELD_TYPE,
  U_INT_32_FIELD_TYPE,
  U_INT_8_FIELD_TYPE,
  INT_256_FIELD_TYPE,
  INT_32_FIELD_TYPE,
  INT_8_FIELD_TYPE,
  BYTES_FIELD_TYPE,
} from '../fields/fields';
import validateAddressField from './validateAddressField';
import validateAmountField from './validateAmountField';
import validateField from './validateField';
import validateHexEncodedDataField from './validateHexEncodedDataField';

const NO_ERROR_IS_PRESENT = undefined;

describe('form validations', () => {
  describe('validation functions', () => {
    describe('validateAddressField', () => {
      it('validates an invalid address', () => {
        const validationResult = validateAddressField('INVALID ADDRESS VALUE');

        expect(validationResult).toBe('Invalid address');
      });

      it('validates a valid address', () => {
        const validationResult = validateAddressField('0x57CB13cbef735FbDD65f5f2866638c546464E45F');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });
    });

    describe('validateAmountField', () => {
      it('validates negative amount', () => {
        const validationResult = validateAmountField('-3');

        expect(validationResult).toBe('Invalid amount value');
      });

      it('validates invalid amounts', () => {
        const validationResult = validateAmountField('INVALID AMOUNT');

        expect(validationResult).toBe('Invalid amount value');
      });

      it('validates hexadecimal amounts', () => {
        const validationResult = validateAmountField('0x123');

        expect(validationResult).toBe('Invalid amount value');
      });

      it('validates valid decimal amounts', () => {
        const validationResult = validateAmountField('3.12');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });

      it('validates invalid decimal amounts', () => {
        const validationResult = validateAmountField('0.000000000000000000000000000000001');

        expect(validationResult).toBe('Invalid amount value');
      });
    });

    describe('validateHexEncodedDataField', () => {
      it('validates non hexadecimal values', () => {
        const validationResult = validateHexEncodedDataField('INVALID HEX DATA');

        expect(validationResult).toBe('Has to be a valid strict hex data (it must start with 0x)');
      });

      it('validates non hexadecimal values starting with 0x', () => {
        const validationResult = validateHexEncodedDataField('0x INVALID HEX DATA');

        expect(validationResult).toBe('Has to be a valid strict hex data');
      });

      it('validates an invalid hexadecimal value', () => {
        const validationResult = validateHexEncodedDataField('0x123456789ABCDEFGHI');

        expect(validationResult).toBe('Has to be a valid strict hex data');
      });

      it('validates a valid hexadecimal value', () => {
        const validationResult = validateHexEncodedDataField('0x123456789ABCDEF');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });
    });
  });

  describe('Solidity field types validations', () => {
    describe('address field type', () => {
      it('validates an invalid address', () => {
        const addressValidations = validateField(ADDRESS_FIELD_TYPE);

        const validationResult = addressValidations('INVALID ADDRESS VALUE');

        expect(validationResult).toBe('Invalid address');
      });

      it('validates a valid address', () => {
        const addressValidations = validateField(ADDRESS_FIELD_TYPE);

        const validationResult = addressValidations('0x57CB13cbef735FbDD65f5f2866638c546464E45F');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });
    });

    describe('boolean field type', () => {
      it('validates an invalid boolean value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE);

        const validationResult = booleanValidations('INVALID BOOLEAN VALUE');

        expect(validationResult).toBe('Invalid boolean value');
      });

      it('validates an valid boolean true value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE);

        const validationResult = booleanValidations('TRUE');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });

      it('validates an valid boolean false value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE);

        const validationResult = booleanValidations('false');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });

      it('validates an valid boolean capitalized False value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE);

        const validationResult = booleanValidations('False');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
      });
    });

    describe('uint field type', () => {
      describe('uint256', () => {
        it('validates a decimal value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE);

          const validationResult = uint256Validation('123.123');

          expect(validationResult).toContain('format error.');
        });

        it('validates a invalid number value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE);

          const validationResult = uint256Validation('INVALID NUMBER VALUE');

          expect(validationResult).toContain('format error.');
        });

        it('validates a negative value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE);

          const validationResult = uint256Validation('-123');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a uint256 overflow value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE);

          const validationResult = uint256Validation(
            '9999999999999999999999999999999999999999999999999999999999999999999999999999999',
          );

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a uint256 valid value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE);

          const validationResult = uint256Validation('1234567891011121314');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });
      });

      describe('uint32', () => {
        it('validates a negative value', () => {
          const uint32Validation = validateField(U_INT_32_FIELD_TYPE);

          const validationResult = uint32Validation('-123');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a uint32 overflow value', () => {
          const uint32Validation = validateField(U_INT_32_FIELD_TYPE);

          const validationResult = uint32Validation('4294967296');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a uint32 valid value', () => {
          const uint32Validation = validateField(U_INT_32_FIELD_TYPE);

          const validationResult = uint32Validation('4294967295');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });
      });

      describe('uint8', () => {
        it('validates a negative value', () => {
          const uint8Validation = validateField(U_INT_8_FIELD_TYPE);

          const validationResult = uint8Validation('-123');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a uint8 overflow value', () => {
          const uint8Validation = validateField(U_INT_8_FIELD_TYPE);

          const validationResult = uint8Validation('9999999');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a uint8 valid value', () => {
          const uint8Validation = validateField(U_INT_8_FIELD_TYPE);

          const validationResult = uint8Validation('255');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });
      });
    });

    describe('int field type', () => {
      describe('int256', () => {
        it('validates a negative value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE);

          const validationResult = int256Validation('-123');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });

        it('validates a decimal value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE);

          const validationResult = int256Validation('123.123');

          expect(validationResult).toContain('format error.');
        });

        it('validates a invalid number value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE);

          const validationResult = int256Validation('INVALID NUMBER VALUE');

          expect(validationResult).toContain('format error.');
        });

        it('validates a int256 overflow negative value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE);

          const validationResult = int256Validation(
            '-57896044618658097711785492504343953926634992332820282019728792003956564819969',
          );

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a int256 overflow value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE);

          const validationResult = int256Validation(
            '57896044618658097711785492504343953926634992332820282019728792003956564819968',
          );

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a int256 valid value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE);

          const validationResult = int256Validation(
            '57896044618658097711785492504343953926634992332820282019728792003956564819967',
          );

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });
      });

      describe('int32', () => {
        it('validates a negative value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE);

          const validationResult = int32Validation('-2147483648');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });

        it('validates a int32 overflow negative value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE);

          const validationResult = int32Validation('-2147483649');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a int32 overflow value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE);

          const validationResult = int32Validation('2147483648');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a int32 valid value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE);

          const validationResult = int32Validation('2147483647');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });
      });

      describe('int8', () => {
        it('validates a negative value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE);

          const validationResult = int8Validation('-128');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });

        it('validates a int8 overflow negative value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE);

          const validationResult = int8Validation('-129');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a int8 overflow value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE);

          const validationResult = int8Validation('9999999');

          expect(validationResult).toBe('format error. details: value out-of-bounds');
        });

        it('validates a int8 valid value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE);

          const validationResult = int8Validation('127');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });
      });
    });

    describe('bytes field type', () => {
      describe('bytes', () => {
        it('validates a bytes valid value', () => {
          const bytesValidation = validateField(BYTES_FIELD_TYPE);

          const validationResult = bytesValidation('0x123');

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
        });

        it('validates an invalid value', () => {
          const bytesValidation = validateField(BYTES_FIELD_TYPE);

          const validationResult = bytesValidation('INVALID VALUE');

          expect(validationResult).toBe('format error. details: invalid arrayify value');
        });
      });
    });
  });
});
