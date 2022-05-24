import { getInputTypeHelper } from '../../../utils'
import { ADDRESS_FIELD_TYPE, BOOLEAN_FIELD_TYPE } from '../fields/fields'
import validateAddressField from './validateAddressField'
import validateAmountField from './validateAmountField'
import validateField from './validateField'
import validateHexEncodedDataField from './validateHexEncodedDataField'

const U_INT_256_FIELD_TYPE = 'uint256'
const U_INT_32_FIELD_TYPE = 'uint32'
const U_INT_8_FIELD_TYPE = 'uint8'
const INT_256_FIELD_TYPE = 'int256'
const INT_32_FIELD_TYPE = 'int32'
const INT_8_FIELD_TYPE = 'int8'

const NO_ERROR_IS_PRESENT = undefined

describe('form validations', () => {
  describe('validation functions', () => {
    describe('validateAddressField', () => {
      it('validates an invalid address', () => {
        const validationResult = validateAddressField('INVALID ADDRESS VALUE')

        expect(validationResult).toBe('Invalid address')
      })

      it('validates a valid address', () => {
        const validationResult = validateAddressField('0x57CB13cbef735FbDD65f5f2866638c546464E45F')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })
    })

    describe('validateAmountField', () => {
      it('validates negative amount', () => {
        const validationResult = validateAmountField('-3')

        expect(validationResult).toBe('Invalid amount value')
      })

      it('validates invalid amounts', () => {
        const validationResult = validateAmountField('INVALID AMOUNT')

        expect(validationResult).toBe('Invalid amount value')
      })

      it('validates hexadecimal amounts', () => {
        const validationResult = validateAmountField('0x123')

        expect(validationResult).toBe('Invalid amount value')
      })

      it('validates valid decimal amounts', () => {
        const validationResult = validateAmountField('3.12')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates invalid decimal amounts', () => {
        const validationResult = validateAmountField('0.000000000000000000000000000000001')

        expect(validationResult).toBe('Invalid amount value')
      })
    })

    describe('validateHexEncodedDataField', () => {
      it('validates non hexadecimal values', () => {
        const validationResult = validateHexEncodedDataField('INVALID HEX DATA')

        expect(validationResult).toBe('Has to be a valid strict hex data (it must start with 0x)')
      })

      it('validates non hexadecimal values starting with 0x', () => {
        const validationResult = validateHexEncodedDataField('0x INVALID HEX DATA')

        expect(validationResult).toBe('Has to be a valid strict hex data')
      })

      it('validates an invalid hexadecimal value', () => {
        const validationResult = validateHexEncodedDataField('0x123456789ABCDEFGHI')

        expect(validationResult).toBe('Has to be a valid strict hex data')
      })

      it('validates a valid hexadecimal value', () => {
        const validationResult = validateHexEncodedDataField('0x123456789ABCDEF')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })
    })
  })

  describe('Solidity field types validations', () => {
    describe('address field type', () => {
      it('validates an invalid address', () => {
        const addressValidations = validateField(ADDRESS_FIELD_TYPE)

        const validationResult = addressValidations('INVALID ADDRESS VALUE')

        expect(validationResult).toBe('Invalid address')
      })

      it('validates a valid address', () => {
        const addressValidations = validateField(ADDRESS_FIELD_TYPE)

        const validationResult = addressValidations('0x57CB13cbef735FbDD65f5f2866638c546464E45F')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })
    })

    describe('boolean field type', () => {
      it('validates an invalid boolean value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE)

        const validationResult = booleanValidations('INVALID BOOLEAN VALUE')

        expect(validationResult).toBe('Invalid boolean value')
      })

      it('validates an valid boolean true value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE)

        const validationResult = booleanValidations('TRUE')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates an valid boolean false value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE)

        const validationResult = booleanValidations('false')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates an valid boolean capitalized False value', () => {
        const booleanValidations = validateField(BOOLEAN_FIELD_TYPE)

        const validationResult = booleanValidations('False')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })
    })

    describe('bytes field type', () => {
      it('validates valid hexadecimal bytes value with 0x prefix', () => {
        const bytesValidations = validateField('bytes')

        const validationResult = bytesValidations('0x1234567890ABCDEFabcdef')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates valid bytes value without 0x prefix', () => {
        const bytesValidations = validateField('bytes')

        const validationResult = bytesValidations('FFF')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates invalid bytes value', () => {
        const bytesValidations = validateField('bytes')

        const validationResult = bytesValidations('INVALID_VALUE')

        expect(validationResult).toBe('format error. details: invalid arrayify value')
      })

      it('this should fail but it seems to be a valid bytes value', () => {
        const bytesValidations = validateField('bytes')

        const validationResult = bytesValidations('ññ2')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      describe('bytes1', () => {
        it('validates valid hexadecimal bytes1 value with 0x prefix', () => {
          const bytesValidations = validateField('bytes1')

          const validationResult = bytesValidations('0xaF')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid bytes1 value', () => {
          const bytesValidations = validateField('bytes1')

          const validationResult = bytesValidations('INVALID_VALUE')

          expect(validationResult).toBe('format error. details: invalid arrayify value')
        })

        it('validates out of range bytes1 value', () => {
          const bytesValidations = validateField('bytes1')

          const validationResult = bytesValidations('0xFFF')

          expect(validationResult).toBe('format error. details: incorrect data length')
        })
      })

      describe('bytes32', () => {
        it('validates valid hexadecimal bytes32 value with 0x prefix', () => {
          const bytesValidations = validateField('bytes32')

          const validationResult = bytesValidations('0xFFDFDaadeab213309843FF')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid bytes32 value', () => {
          const bytesValidations = validateField('bytes32')

          const validationResult = bytesValidations('INVALID_VALUE')

          expect(validationResult).toBe('format error. details: invalid arrayify value')
        })

        it('validates out of range bytes32 value', () => {
          const bytesValidations = validateField('bytes32')

          const validationResult = bytesValidations(
            '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
          )

          expect(validationResult).toBe('format error. details: incorrect data length')
        })
      })
    })

    describe('string type', () => {
      it('validates string value', () => {
        const stringValidations = validateField('string')

        const validationResult = stringValidations('Hello World!')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })
    })

    describe('uint field type', () => {
      describe('uint256', () => {
        it('validates a decimal value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE)

          const validationResult = uint256Validation('123.123')

          expect(validationResult).toContain('format error.')
        })

        it('validates a invalid number value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE)

          const validationResult = uint256Validation('INVALID NUMBER VALUE')

          expect(validationResult).toContain('format error.')
        })

        it('validates a negative value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE)

          const validationResult = uint256Validation('-123')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint256 overflow value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE)

          const validationResult = uint256Validation(
            '9999999999999999999999999999999999999999999999999999999999999999999999999999999',
          )

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint256 valid value', () => {
          const uint256Validation = validateField(U_INT_256_FIELD_TYPE)

          const validationResult = uint256Validation('1234567891011121314')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('uint32', () => {
        it('validates a negative value', () => {
          const uint32Validation = validateField(U_INT_32_FIELD_TYPE)

          const validationResult = uint32Validation('-123')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint32 overflow value', () => {
          const uint32Validation = validateField(U_INT_32_FIELD_TYPE)

          const validationResult = uint32Validation('4294967296')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint32 valid value', () => {
          const uint32Validation = validateField(U_INT_32_FIELD_TYPE)

          const validationResult = uint32Validation('4294967295')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('uint8', () => {
        it('validates a negative value', () => {
          const uint8Validation = validateField(U_INT_8_FIELD_TYPE)

          const validationResult = uint8Validation('-123')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint8 overflow value', () => {
          const uint8Validation = validateField(U_INT_8_FIELD_TYPE)

          const validationResult = uint8Validation('9999999')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint8 valid value', () => {
          const uint8Validation = validateField(U_INT_8_FIELD_TYPE)

          const validationResult = uint8Validation('255')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })
    })

    describe('int field type', () => {
      describe('int256', () => {
        it('validates a negative value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE)

          const validationResult = int256Validation('-123')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates a decimal value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE)

          const validationResult = int256Validation('123.123')

          expect(validationResult).toContain('format error.')
        })

        it('validates a invalid number value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE)

          const validationResult = int256Validation('INVALID NUMBER VALUE')

          expect(validationResult).toContain('format error.')
        })

        it('validates a int256 overflow negative value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE)

          const validationResult = int256Validation(
            '-57896044618658097711785492504343953926634992332820282019728792003956564819969',
          )

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int256 overflow value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE)

          const validationResult = int256Validation(
            '57896044618658097711785492504343953926634992332820282019728792003956564819968',
          )

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int256 valid value', () => {
          const int256Validation = validateField(INT_256_FIELD_TYPE)

          const validationResult = int256Validation(
            '57896044618658097711785492504343953926634992332820282019728792003956564819967',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('int32', () => {
        it('validates a negative value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE)

          const validationResult = int32Validation('-2147483648')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates a int32 overflow negative value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE)

          const validationResult = int32Validation('-2147483649')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int32 overflow value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE)

          const validationResult = int32Validation('2147483648')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int32 valid value', () => {
          const int32Validation = validateField(INT_32_FIELD_TYPE)

          const validationResult = int32Validation('2147483647')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('int8', () => {
        it('validates a negative value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE)

          const validationResult = int8Validation('-128')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates a int8 overflow negative value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE)

          const validationResult = int8Validation('-129')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int8 overflow value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE)

          const validationResult = int8Validation('9999999')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int8 valid value', () => {
          const int8Validation = validateField(INT_8_FIELD_TYPE)

          const validationResult = int8Validation('127')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })
    })

    describe('tuple field type', () => {
      it('validates a tuple', () => {
        const inputType = getInputTypeHelper({
          components: [
            {
              internalType: 'uint128',
              name: 'allocated',
              type: 'uint128',
            },
            {
              internalType: 'uint128',
              name: 'loss',
              type: 'uint128',
            },
          ],
          internalType: 'struct AllocatorLimits',
          name: 'limits',
          type: 'tuple',
        })

        const tupleValidation = validateField(inputType)

        let validationResult = tupleValidation('[1,1]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)

        validationResult = tupleValidation('[1]')

        expect(validationResult).toContain(
          'format error. details: TypeError: Cannot read properties of undefined',
        )
      })

      it('validates a tuple[]', () => {
        const inputType = getInputTypeHelper({
          components: [
            {
              internalType: 'address payable',
              name: 'signer',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'minGasPrice',
              type: 'uint256',
            },
          ],
          internalType: 'struct IMetaTransactionsFeature.MetaTransactionData[]',
          name: 'mtxs',
          type: 'tuple[]',
        })

        const tupleValidation = validateField(inputType)

        let validationResult = tupleValidation(
          '[["0x57CB13cbef735FbDD65f5f2866638c546464E45F", "0x57CB13cbef735FbDD65f5f2866638c546464E45F", 1], ["0x57CB13cbef735FbDD65f5f2866638c546464E45F", "0x57CB13cbef735FbDD65f5f2866638c546464E45F", 1]]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)

        validationResult = tupleValidation(
          '["0x57CB13cbef735FbDD65f5f2866638c546464E45F", "0x57CB13cbef735FbDD65f5f2866638c546464E45F", 1], ["0x57CB13cbef735FbDD65f5f2866638c546464E45F", "0x57CB13cbef735FbDD65f5f2866638c546464E45F", 1]',
        )

        expect(validationResult).toContain('format error. details: SyntaxError: Unexpected token')
      })

      it('validates a tuple with nested tuples', () => {
        const inputType = getInputTypeHelper({
          name: 's',
          type: 'tuple',
          internalType: 'tuple',
          components: [
            {
              name: 'a',
              internalType: 'uint256',
              type: 'uint256',
            },
            {
              name: 'b',
              internalType: 'uint256[]',
              type: 'uint256[]',
            },
            {
              name: 'c',
              type: 'tuple[]',
              internalType: 'tuple[]',
              components: [
                {
                  name: 'x',
                  internalType: 'uint256',
                  type: 'uint256',
                },
                {
                  name: 'y',
                  internalType: 'uint256',
                  type: 'uint256',
                },
                {
                  name: 'z',
                  internalType: 'tuple',
                  type: 'tuple',
                  components: [
                    {
                      name: 'a',
                      internalType: 'uint256',
                      type: 'uint256',
                    },
                    {
                      name: 'b',
                      internalType: 'uint256',
                      type: 'uint256',
                    },
                  ],
                },
              ],
            },
          ],
        })

        const tupleValidation = validateField(inputType)

        let validationResult = tupleValidation('[1,[2,3],[[3,3,[5,5]],[4,4,[6,6]]]]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)

        validationResult = tupleValidation('[1,[2,3],[[3],[4]]]')

        expect(validationResult).toContain('format error. details: types/value length mismatch')
      })
    })

    describe('array of integers', () => {
      it('empty array is a valid value for variable-length arrays', () => {
        const arrayOfIntsValidation = validateField('int[]')

        const validationResult = arrayOfIntsValidation('[]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('empty array is NOT a valid value for fixed-length arrays', () => {
        const arrayOfIntsValidation = validateField('int[3]')

        const validationResult = arrayOfIntsValidation('[]')

        expect(validationResult).toBe('format error. details: missing argument: coder array')
      })

      it('validates valid number values', () => {
        const arrayOfIntsValidation = validateField('int[]')

        const validationResult = arrayOfIntsValidation('[1, 2]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates valid string values', () => {
        const arrayOfIntsValidation = validateField('int[]')

        const validationResult = arrayOfIntsValidation('["1", "2"]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates mix valid string and number values', () => {
        const arrayOfIntsValidation = validateField('int[]')

        const validationResult = arrayOfIntsValidation(
          '["1",   "2   ",     3, 4   , "0xD", "A", a, A,    0xB, 0xb, 0x1   , -0x1, -0xF, -F]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates invalid fixed length array too many arguments', () => {
        const arrayOfIntsValidation = validateField('int[3]')

        const validationResult = arrayOfIntsValidation('[1,2,3,4]')

        expect(validationResult).toBe('format error. details: too many arguments: coder array')
      })

      it('validates invalid fixed length array missing arguments', () => {
        const arrayOfIntsValidation = validateField('int[4]')

        const validationResult = arrayOfIntsValidation('[1,2]')

        expect(validationResult).toBe('format error. details: missing argument: coder array')
      })

      it('validates valid fixed length array', () => {
        const arrayOfIntsValidation = validateField('int[3]')

        const validationResult = arrayOfIntsValidation('[1,2, 3]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates valid hexadecimal values', () => {
        const arrayOfIntsValidation = validateField('int[10]')

        const validationResult = arrayOfIntsValidation(
          '["0xD", "A", a, A, 0xB, 0xb, 0x1, -0x1, -0xF, -F]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      describe('negative values', () => {
        describe('negative integers int', () => {
          it('validates valid negative values as string values', () => {
            const arrayOfIntsValidation = validateField('int[]')

            const validationResult = arrayOfIntsValidation('["-1", "-2"]')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates valid negative values as number values', () => {
            const arrayOfIntsValidation = validateField('int[]')

            const validationResult = arrayOfIntsValidation('[-1, -2]')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates valid negative values with string and number values', () => {
            const arrayOfIntsValidation = validateField('int[]')

            const validationResult = arrayOfIntsValidation('[-1, -2, "-3", "4"]')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out of range values with number values', () => {
            const arrayOfIntsValidation = validateField('int8[]')

            const validationResult = arrayOfIntsValidation('[8888, 8888, 1]')

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out of range values with string values', () => {
            const arrayOfIntsValidation = validateField('int8[]')

            const validationResult = arrayOfIntsValidation('["8888", "8888", "1"]')

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values with number values', () => {
            const arrayOfIntsValidation = validateField('int8[]')

            const validationResult = arrayOfIntsValidation('[1, 2]')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates valid values with string values', () => {
            const arrayOfIntsValidation = validateField('int8[]')

            const validationResult = arrayOfIntsValidation('["1", "2"]')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates valid hexadecimal values', () => {
            const arrayOfIntsValidation = validateField('int8[]')

            const validationResult = arrayOfIntsValidation(
              '["0xD", "A", a, A, 0xB, 0xb, 0x1, -0x1, -0xF, -F]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })
        })

        describe('negative integers uint', () => {
          it('validates invalid negative values as string values', () => {
            const arrayOfIntsValidation = validateField('uint[]')

            const validationResult = arrayOfIntsValidation('["-1", "-2"]')

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates invalid negative values as number values', () => {
            const arrayOfIntsValidation = validateField('uint[]')

            const validationResult = arrayOfIntsValidation('[-1, -2]')

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates invalid negative values with string and number values', () => {
            const arrayOfIntsValidation = validateField('uint[]')

            const validationResult = arrayOfIntsValidation('[-1, -2, "-3", "-4"]')

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })
        })
      })

      describe('out of range javascript numbers issue', () => {
        it('validates out of range javascript numbers values', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation(
            '[6426191757410075707, 6426191757410075707]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates out of range javascript numbers as string values', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation(
            '["6426191757410075707", "6426191757410075707"]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates out of range javascript numbers as string and number values', () => {
          const arrayOfIntsValidation = validateField('int[2]')

          const validationResult = arrayOfIntsValidation(
            '["6426191757410075707", 6426191757410075707]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        // issue related with long negative numbers for dynamic arrays of elements less than 152 bits
        describe('issue with dynamic arrays for int152[] with negative long values', () => {
          it('issue with int64[] long negative numbers', () => {
            const arrayOfIntsValidation = validateField('int64[]')

            const validationResult = arrayOfIntsValidation(
              '[-6426191757410075707,"-6426191757410075707"]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('issue with int128[] long negative numbers', () => {
            const arrayOfIntsValidation = validateField('int128[]')

            const validationResult = arrayOfIntsValidation(
              '[-6426191757410075707,"-6426191757410075707"]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('issue with a lot of values for int128[]', () => {
            const arrayOfIntsValidation = validateField('int128[]')

            const validationResult = arrayOfIntsValidation(
              '["-6426191757410075707", -6426191757410075707, -2, "6426191757410075707", 6426191757410075707, 2, "0x123", "0xaaafff"]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('issue with int152[] long negative numbers', () => {
            const arrayOfIntsValidation = validateField('int152[]')

            const validationResult = arrayOfIntsValidation(
              '[-6426191757410075707,"-6426191757410075707"]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('issue with int160[] long negative numbers', () => {
            const arrayOfIntsValidation = validateField('int160[]')

            const validationResult = arrayOfIntsValidation(
              '[-6426191757410075707,"-6426191757410075707"]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('issue with int256[] long negative numbers', () => {
            const arrayOfIntsValidation = validateField('int256[]')

            const validationResult = arrayOfIntsValidation(
              '[-6426191757410075707,"-6426191757410075707"]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })
        })
      })

      describe('invalid array values', () => {
        it('validates array of invalid string values', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation('["invalid_array_value"]')

          expect(validationResult).toBe(
            'format error. details: Error: Error: [number-to-bn] while converting number "invalid_array_value" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "invalid_array_value"',
          )
        })

        it('validates invalid array ', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation('invalid_array_value')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })

        it('validates invalid item value within the array', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation('[invalid_array_value]')

          expect(validationResult).toBe(
            'format error. details: Error: Error: [number-to-bn] while converting number "invalid_array_value" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "invalid_array_value"',
          )
        })

        it('validates invalid number value', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation('1234')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })

        it('validates invalid string value', () => {
          const arrayOfIntsValidation = validateField('int[]')

          const validationResult = arrayOfIntsValidation('"1234"')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })
      })
    })

    describe('array of addresses', () => {
      it('validates dinamic array of valid addresses', () => {
        const arrayOfAddressesValidation = validateField('address[]')

        const validationResult = arrayOfAddressesValidation(
          '[0x680cde08860141F9D223cE4E620B10Cd6741037E, 0x57CB13cbef735FbDD65f5f2866638c546464E45F]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates dinamic array of valid addresses as strings', () => {
        const arrayOfAddressesValidation = validateField('address[]')

        const validationResult = arrayOfAddressesValidation(
          '["0x680cde08860141F9D223cE4E620B10Cd6741037E", "0x57CB13cbef735FbDD65f5f2866638c546464E45F"]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates empty array as valid value for dinamic array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[]')

        const validationResult = arrayOfAddressesValidation('[]')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates invalid array for dinamic array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[]')

        const validationResult = arrayOfAddressesValidation('INVALID_ARRAY')

        expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
      })

      it('validates invalid array values for dinamic array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[]')

        const validationResult = arrayOfAddressesValidation('[INVALID_ADDRESS_VALUE]')

        expect(validationResult).toBe(
          'format error. details: invalid address (argument="address", value="INVALID_ADDRESS_VALUE", code=INVALID_ARGUMENT, version=address/5.5.0)',
        )
      })

      it('validates fixed array of valid addresses', () => {
        const arrayOfAddressesValidation = validateField('address[2]')

        const validationResult = arrayOfAddressesValidation(
          '[0x680cde08860141F9D223cE4E620B10Cd6741037E, 0x57CB13cbef735FbDD65f5f2866638c546464E45F]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates fixed array of valid addresses as strings', () => {
        const arrayOfAddressesValidation = validateField('address[2]')

        const validationResult = arrayOfAddressesValidation(
          '["0x680cde08860141F9D223cE4E620B10Cd6741037E", "0x57CB13cbef735FbDD65f5f2866638c546464E45F"]',
        )

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates fixed array of valid addresses with invalid length of elements', () => {
        const arrayOfAddressesValidation = validateField('address[5]')

        // only one is provided
        const validationResult = arrayOfAddressesValidation(
          '["0x680cde08860141F9D223cE4E620B10Cd6741037E"]',
        )

        expect(validationResult).toBe('format error. details: missing argument: coder array')
      })

      it('validates empty array as valid value for fixed array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[2]')

        const validationResult = arrayOfAddressesValidation('[]')

        expect(validationResult).toBe('format error. details: missing argument: coder array')
      })

      it('validates invalid array for fixed array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[2]')

        const validationResult = arrayOfAddressesValidation('INVALID_ARRAY')

        expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
      })

      it('validates invalid array values for fixed array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[2]')

        // only one is invalid
        const validationResult = arrayOfAddressesValidation(
          '[INVALID_ADDRESS_VALUE, 0x680cde08860141F9D223cE4E620B10Cd6741037E]',
        )

        expect(validationResult).toBe(
          'format error. details: invalid address (argument="address", value="INVALID_ADDRESS_VALUE", code=INVALID_ARGUMENT, version=address/5.5.0)',
        )
      })
    })

    describe('array of bytes', () => {
      describe('dinamic array of bytes', () => {
        it('validates valid array values for dynamic array of bytes', () => {
          const arrayOfBytesValidation = validateField('bytes[]')

          const validationResult = arrayOfBytesValidation(
            '[0x123F, 0xAAAAFF, 0xFaaaaFFFF, 0x0001, 0x0]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates valid empty array value for dynamic array of bytes', () => {
          const arrayOfBytesValidation = validateField('bytes[]')

          const validationResult = arrayOfBytesValidation('[]')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid array', () => {
          const arrayOfBytesValidation = validateField('bytes[]')

          const validationResult = arrayOfBytesValidation('INVALID_ARRAY')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })

        it('validates invalid array values', () => {
          const arrayOfBytesValidation = validateField('bytes[]')

          const validationResult = arrayOfBytesValidation('[INVALID_VALUE, 0x123]')

          expect(validationResult).toBe('format error. details: invalid arrayify value')
        })
      })

      describe('fixed array of bytes', () => {
        // TODO: REVIEW THIS TESTS CASE
        it.skip('validates valid array values for fixed array of bytes', () => {
          const arrayOfBytesValidation = validateField('bytes[5]')

          const validationResult = arrayOfBytesValidation(
            '[0x123F, 0xAAAAFF, 0xFaaaaFFFF, 0x0001, 0x0]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid array lenght for fixed array of bytes', () => {
          const arrayOfBytesValidation = validateField('bytes[3]')

          const validationResult = arrayOfBytesValidation(
            '[0x123F, 0xAAAAFF, 0xFaaaaFFFF, 0x0001, 0x0]',
          )

          expect(validationResult).toBe('format error. details: too many arguments: coder array')
        })

        it('validates invalid empty array value for fixed array of bytes', () => {
          const arrayOfBytesValidation = validateField('bytes[3]')

          const validationResult = arrayOfBytesValidation('[]')

          expect(validationResult).toBe('format error. details: missing argument: coder array')
        })

        it('validates invalid array', () => {
          const arrayOfBytesValidation = validateField('bytes[3]')

          const validationResult = arrayOfBytesValidation('INVALID_ARRAY')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })

        it('validates invalid array values', () => {
          const arrayOfBytesValidation = validateField('bytes[2]')

          const validationResult = arrayOfBytesValidation('[INVALID_VALUE, 0x123]')

          expect(validationResult).toBe('format error. details: invalid arrayify value')
        })
      })
    })
    // TODO: ADD ARRAY OF BOOLS
    // TODO: ADD ARRAY OF STRINGS

    // TODO: ADD MATRIX
    // TODO: ADD MULTIDIMENSIONAL ARRAYS
  })
})
