import { ADDRESS_FIELD_TYPE, BOOLEAN_FIELD_TYPE, U_INT_FIELD_TYPE } from '../fields/fields';
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

      it('validates valid amounts', () => {
        const validationResult = validateAmountField('3.12');

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT);
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

  describe('Solodity field types validations', () => {
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
      it('validates a negative value', () => {
        const uintValidation = validateField(U_INT_FIELD_TYPE);

        const validationResult = uintValidation('-123');

        expect(validationResult).toBe('format error. details: value out-of-bounds');
      });

      it('validates a uint overflow value', () => {
        const uintValidation = validateField(U_INT_FIELD_TYPE);

        const validationResult = uintValidation(
          '9999999999999999999999999999999999999999999999999999999999999999999999999999999',
        );

        expect(validationResult).toBe('format error. details: value out-of-bounds');
      });
    });
  });
});
