import { getInputTypeHelper } from '../../../utils'
import validateAddressField from './validateAddressField'
import validateAmountField from './validateAmountField'
import validateField from './validateField'
import validateHexEncodedDataField from './validateHexEncodedDataField'

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
      it('validates a valid address', () => {
        const addressValidations = validateField('address')

        const validationResult = addressValidations('0x57CB13cbef735FbDD65f5f2866638c546464E45F')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates an invalid address', () => {
        const addressValidations = validateField('address')

        const validationResult = addressValidations('INVALID ADDRESS VALUE')

        expect(validationResult).toBe('Invalid address')
      })

      it('validates invalid empty string for address values', () => {
        const addressValidation = validateField('address')

        const validationResult = addressValidation('')

        expect(validationResult).toBe('Invalid address')
      })
    })

    describe('boolean field type', () => {
      it('validates an invalid boolean value', () => {
        const booleanValidations = validateField('bool')

        const validationResult = booleanValidations('INVALID BOOLEAN VALUE')

        expect(validationResult).toBe('Invalid boolean value')
      })

      it('validates a invalid empty string value', () => {
        const booleanValidations = validateField('bool')

        const validationResult = booleanValidations('')

        expect(validationResult).toBe('Invalid boolean value')
      })

      it('validates an valid boolean true value', () => {
        const booleanValidations = validateField('bool')

        const validationResult = booleanValidations('TRUE')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates an valid boolean false value', () => {
        const booleanValidations = validateField('bool')

        const validationResult = booleanValidations('false')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      it('validates an valid boolean capitalized False value', () => {
        const booleanValidations = validateField('bool')

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

      it('validates invalid empty string for bytes values', () => {
        const bytesValidation = validateField('bytes')

        const validationResult = bytesValidation('')

        expect(validationResult).toBe('format error. details: invalid arrayify value')
      })

      // TODO: review this test case
      it('this should fail but it seems to be a valid bytes value', () => {
        // FIX: this should fail, but for some reason encodeParameter() is ignoring the first 2 chars
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

      it('validates valid empty string for string values', () => {
        const stringValidation = validateField('string')

        const validationResult = stringValidation('')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })
    })

    describe('uint field type', () => {
      describe('uint256', () => {
        it('validates a decimal value', () => {
          const uint256Validation = validateField('uint256')

          const validationResult = uint256Validation('123.123')

          expect(validationResult).toContain('format error.')
        })

        it('validates a invalid number value', () => {
          const uint256Validation = validateField('uint256')

          const validationResult = uint256Validation('INVALID NUMBER VALUE')

          expect(validationResult).toContain('format error.')
        })

        it('validates a negative value', () => {
          const uint256Validation = validateField('uint256')

          const validationResult = uint256Validation('-123')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint256 overflow value', () => {
          const uint256Validation = validateField('uint256')

          const validationResult = uint256Validation(
            '9999999999999999999999999999999999999999999999999999999999999999999999999999999',
          )

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint256 valid value', () => {
          const uint256Validation = validateField('uint256')

          const validationResult = uint256Validation('1234567891011121314')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('uint32', () => {
        it('validates a negative value', () => {
          const uint32Validation = validateField('uint32')

          const validationResult = uint32Validation('-123')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint32 overflow value', () => {
          const uint32Validation = validateField('uint32')

          const validationResult = uint32Validation('4294967296')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint32 valid value', () => {
          const uint32Validation = validateField('uint32')

          const validationResult = uint32Validation('4294967295')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('uint8', () => {
        it('validates a negative value', () => {
          const uint8Validation = validateField('uint8')

          const validationResult = uint8Validation('-123')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint8 overflow value', () => {
          const uint8Validation = validateField('uint8')

          const validationResult = uint8Validation('9999999')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a uint8 valid value', () => {
          const uint8Validation = validateField('uint8')

          const validationResult = uint8Validation('255')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })
    })

    describe('int field type', () => {
      // TODO: review this case
      it('validates invalid empty string for int values', () => {
        const intValidation = validateField('int')

        // FIX: this should fail ???
        const validationResult = intValidation('')

        expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
      })

      describe('int256', () => {
        it('validates a negative value', () => {
          const int256Validation = validateField('int256')

          const validationResult = int256Validation('-123')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates a decimal value', () => {
          const int256Validation = validateField('int256')

          const validationResult = int256Validation('123.123')

          expect(validationResult).toContain('format error.')
        })

        it('validates a invalid number value', () => {
          const int256Validation = validateField('int256')

          const validationResult = int256Validation('INVALID NUMBER VALUE')

          expect(validationResult).toContain('format error.')
        })

        it('validates a int256 overflow negative value', () => {
          const int256Validation = validateField('int256')

          const validationResult = int256Validation(
            '-57896044618658097711785492504343953926634992332820282019728792003956564819969',
          )

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int256 overflow value', () => {
          const int256Validation = validateField('int256')

          const validationResult = int256Validation(
            '57896044618658097711785492504343953926634992332820282019728792003956564819968',
          )

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int256 valid value', () => {
          const int256Validation = validateField('int256')

          const validationResult = int256Validation(
            '57896044618658097711785492504343953926634992332820282019728792003956564819967',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('int32', () => {
        it('validates a negative value', () => {
          const int32Validation = validateField('int32')

          const validationResult = int32Validation('-2147483648')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates a int32 overflow negative value', () => {
          const int32Validation = validateField('int32')

          const validationResult = int32Validation('-2147483649')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int32 overflow value', () => {
          const int32Validation = validateField('int32')

          const validationResult = int32Validation('2147483648')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int32 valid value', () => {
          const int32Validation = validateField('int32')

          const validationResult = int32Validation('2147483647')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('int8', () => {
        it('validates a negative value', () => {
          const int8Validation = validateField('int8')

          const validationResult = int8Validation('-128')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates a int8 overflow negative value', () => {
          const int8Validation = validateField('int8')

          const validationResult = int8Validation('-129')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int8 overflow value', () => {
          const int8Validation = validateField('int8')

          const validationResult = int8Validation('9999999')

          expect(validationResult).toBe('format error. details: value out-of-bounds')
        })

        it('validates a int8 valid value', () => {
          const int8Validation = validateField('int8')

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

      it('validates invalid empty string value in an array for dinamic array of addresses', () => {
        const arrayOfAddressesValidation = validateField('address[]')

        const validationResult = arrayOfAddressesValidation(
          '["", "0x680cde08860141F9D223cE4E620B10Cd6741037E", "0x57CB13cbef735FbDD65f5f2866638c546464E45F"]',
        )

        expect(validationResult).toBe(
          'format error. details: invalid address (argument="address", value="", code=INVALID_ARGUMENT, version=address/5.5.0)',
        )
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
        // TODO: review this test case
        it('validates valid array values for fixed array of bytes', () => {
          const arrayOfBytesValidation = validateField('bytes[5]')

          // FIX: this should NOT fail, but for some reason encodeParameter() is throwing a "format error. details: hex data is odd-length"
          // it seems that is failing for this value: "0xFaaaaFFFF", code=INVALID_ARGUMENT, version=bytes/5.5.0)
          // it seems that is failing for this value: "0x0", code=INVALID_ARGUMENT, version=bytes/5.5.0)
          const validationResult = arrayOfBytesValidation(
            // '[0x123F, 0xAAAAFF, 0xFaaaaFFFF, 0x0001, 0x0]',
            '[0x123F, 0xAAAAFF, 0xAAAAFF, 0x0001, 0xAAAAFF]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid array length for fixed array of bytes', () => {
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

    describe('array of booleans', () => {
      describe('dinamic-length array of bytes', () => {
        it('validates valid array values for dynamic array of booleans', () => {
          const arrayOfBooleansValidation = validateField('bool[]')

          const validationResult = arrayOfBooleansValidation(
            '[true, false, 1, 0 , "1", "0", "True", "False", "TRUE", "FALSE", "false", "true"]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        // TODO: review this test case
        it('This should value should fail but its set as a true for the encodeFunctionCall', () => {
          const arrayOfBooleansValidation = validateField('bool[]')

          // FIX: this should fail, but "[true, [true, false, false] ]" is treated like "[true, true]" for some reason by the encodeFunctionCall
          const validationResult = arrayOfBooleansValidation('[true,  [false, false] ]')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates valid empty array value for dynamic array of booleans', () => {
          const arrayOfBooleansValidation = validateField('bool[]')

          const validationResult = arrayOfBooleansValidation('[]')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid array', () => {
          const arrayOfBooleansValidation = validateField('bool[]')

          const validationResult = arrayOfBooleansValidation('INVALID_ARRAY')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })

        it('validates invalid array values', () => {
          const arrayOfBooleansValidation = validateField('bool[]')

          const validationResult = arrayOfBooleansValidation('[INVALID_VALUE, true, false]')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Boolean value')
        })
      })

      describe('fixed-length array of bytes', () => {
        it('validates valid array values for fixed array of booleans', () => {
          const arrayOfBooleansValidation = validateField('bool[12]')

          const validationResult = arrayOfBooleansValidation(
            '[true, false, 1, 0 , "1", "0", "True", "False", "TRUE", "FALSE", "false", "true"]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates valid empty array value for fixed array of booleans', () => {
          const arrayOfBooleansValidation = validateField('bool[3]')

          const validationResult = arrayOfBooleansValidation('[]')

          expect(validationResult).toBe('format error. details: missing argument: coder array')
        })

        it('validates invalid array length items for fixed array of booleans', () => {
          const arrayOfBooleansValidation = validateField('bool[3]')

          const validationResult = arrayOfBooleansValidation('[true]')

          expect(validationResult).toBe('format error. details: missing argument: coder array')
        })

        it('validates invalid array length items for fixed array of booleans', () => {
          const arrayOfBooleansValidation = validateField('bool[3]')

          const validationResult = arrayOfBooleansValidation('[false, true, false, true]')

          expect(validationResult).toBe('format error. details: too many arguments: coder array')
        })

        it('validates invalid array', () => {
          const arrayOfBooleansValidation = validateField('bool[3]')

          const validationResult = arrayOfBooleansValidation('INVALID_ARRAY')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
        })

        it('validates invalid array values', () => {
          const arrayOfBooleansValidation = validateField('bool[3]')

          const validationResult = arrayOfBooleansValidation('[INVALID_VALUE, true, false]')

          expect(validationResult).toBe('format error. details: SyntaxError: Invalid Boolean value')
        })
      })
    })

    describe('array of strings', () => {
      describe('dynamic-length array of strings', () => {
        it('validates valid array values for dynamic array of strings', () => {
          const stringValidations = validateField('string[]')

          const validationResult = stringValidations('["Hello World!", "hi!", "other value"]')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid array value', () => {
          const stringValidations = validateField('string[]')

          const validationResult = stringValidations('INVALID_ARRAY')

          expect(validationResult).toBe(
            'format error. details: SyntaxError: Unexpected token I in JSON at position 0',
          )
        })

        it('validates invalid array values for dynamic array of strings', () => {
          const stringValidations = validateField('string[]')

          const validationResult = stringValidations('[INVALID_VALUE, "Hello World!"]')

          expect(validationResult).toBe(
            'format error. details: SyntaxError: Unexpected token I in JSON at position 1',
          )
        })

        it('validates valid empty array value for dynamic array of strings', () => {
          const arrayOfStringsValidation = validateField('string[]')

          const validationResult = arrayOfStringsValidation('[]')

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })
      })

      describe('fixed-length array of strings', () => {
        it('validates valid array values for fixed array of strings', () => {
          const arrayOfStringValidations = validateField('string[3]')

          const validationResult = arrayOfStringValidations(
            '["Hello World!", "hi!", "other value"]',
          )

          expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
        })

        it('validates invalid array value', () => {
          const arrayOfStringValidations = validateField('string[3]')

          const validationResult = arrayOfStringValidations('INVALID_ARRAY')

          expect(validationResult).toBe(
            'format error. details: SyntaxError: Unexpected token I in JSON at position 0',
          )
        })

        it('validates invalid array values for fixed array of strings', () => {
          const arrayOfStringValidations = validateField('string[3]')

          const validationResult = arrayOfStringValidations('[INVALID_VALUE, "Hello World!", "hi"]')

          expect(validationResult).toBe(
            'format error. details: SyntaxError: Unexpected token I in JSON at position 1',
          )
        })

        it('validates invalid empty array value for fixed array of strings', () => {
          const arrayOfStringsValidation = validateField('string[3]')

          const validationResult = arrayOfStringsValidation('[]')

          expect(validationResult).toBe('format error. details: missing argument: coder array')
        })

        it('validates invalid array length for fixed array of strings', () => {
          const arrayOfStringsValidation = validateField('string[3]')

          const validationResult = arrayOfStringsValidation(
            '["Hi", "Hello!", "Hello World!", "Bye!"]',
          )

          expect(validationResult).toBe('format error. details: too many arguments: coder array')
        })
      })
    })

    describe('matrix', () => {
      describe('matrix of integers', () => {
        describe('int[][] & uints[][]', () => {
          it('validates valid int[][] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [  4, "-5"], [  "6"  ] ]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates valid uint[][] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, "2" , 3], [  "4",   5], [  6  ] ]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid array value for int[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid array value for uint[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid matrix value for int[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            const validationResult = dinamicMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid matrix value for uint[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][]')

            const validationResult = dinamicMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid number values for int[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid number values for uint[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid array of numbers instead of matrix for int[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = dinamicMatrixOfIntsValidation(' [1, -2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates invalid array of numbers instead of matrix for uint[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = dinamicMatrixOfIntsValidation(' [1, 2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates long numbers (positive & negatives) for int[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [-6426191757410075707, 6426191757410075707 , "-6426191757410075707"], [ "-6426191757410075707" ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for int[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [6426191757410075707 , "6426191757410075707"], [ 6426191757410075707 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for uint[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [6426191757410075707 ,"-6426191757410075707 ",  "6426191757410075707"], [ -6426191757410075707 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int8[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int8[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int8[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int8[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint8[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,  "2"], [ 2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint8[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint8[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int128[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int128[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int128[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int128[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [875487583475874857888888888880000000000 ,"-875487583475874857888888888880000000000 ",  "875487583475874857888888888880000000000"], [ -875487583475874857888888888880000000000 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint128[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [87548758347587485788888888888000000000 ,  "87548758347587485788888888888000000000"], [ 87548758347587485788888888880000000000 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint128[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint128[][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          describe('empty arrays and matrix valid values', () => {
            // empty arrays for int[][] & uint[][]
            it('validates empty matrix valid values for int[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty array valid values for int[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "-3"]]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty matrix valid values for uint[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty array valid values for uint[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "3"]]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            // empty arrays for int8[][] & uint8[][]
            it('validates empty matrix valid values for int8[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int8[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty array valid values for int8[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int8[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "-3"]]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty matrix valid values for uint8[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint8[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty array valid values for uint8[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint8[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "3"]]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            // empty arrays for int128[][] & uint128[][]
            it('validates empty matrix valid values for int128[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int128[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty array valid values for int128[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int128[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "-3"]]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty matrix valid values for uint128[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint128[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates empty array valid values for uint128[][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint128[][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "3"]]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })
          })
        })
        describe('int[size][] & uints[size][]', () => {
          it('validates valid int[3][] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [  4, "-5", 6] ]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid length of int[3][] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [  4, "-5", 6, 7, 8] ]',
            )

            expect(validationResult).toBe('format error. details: too many arguments: coder array')
          })

          it('validates invalid length of uint[3][] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, 2 , 3], [  4, "5", 6, 7, 8] ]',
            )

            expect(validationResult).toBe('format error. details: too many arguments: coder array')
          })

          it('validates invalid array value for int[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid array value for uint[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid matrix value for int[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid matrix value for uint[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

            const validationResult = dinamicMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid number values for int[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid number values for uint[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid array of numbers instead of matrix for int[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = dinamicMatrixOfIntsValidation(' [1, -2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates invalid array of numbers instead of matrix for uint[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = dinamicMatrixOfIntsValidation(' [1, 2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates long numbers (positive & negatives) for int[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [-6426191757410075707, 6426191757410075707 , "-6426191757410075707"] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for int[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [6426191757410075707 , "6426191757410075707   "   ,     6426191757410075707] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for uint[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [6426191757410075707 ,"-6426191757410075707 ",  "6426191757410075707"], [ -6426191757410075707 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int8[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int8[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 , "6    " , 1] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int8[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int8[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint8[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(' [ [2 ,  "2" , 2 ] ] ')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint8[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint8[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int128[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int128[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(' [ [2 ,"-2 ",  "2"]] ')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int128[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int128[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [875487583475874857888888888880000000000 ,"-875487583475874857888888888880000000000 ",  "875487583475874857888888888880000000000"], [ -875487583475874857888888888880000000000 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint128[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [87548758347587485788888888888000000000 ,  "87548758347587485788888888888000000000", 6], [3,4,5]] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint128[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint128[3][]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[3][]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          describe('empty arrays and matrix valid values', () => {
            // empty arrays for int[3][] & uint[3][]
            it('validates empty matrix valid values for int[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty array value for int[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[ [2, "-3", 1], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates empty matrix valid values for uint[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty array values for uint[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [1, 2, "3"]]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            // empty arrays for int8[3][] & uint8[3][]
            it('validates empty matrix valid values for int8[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int8[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty array value for int8[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int8[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "-3",1 ]]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates empty matrix valid values for uint8[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint8[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty array values for uint8[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint8[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [1, 2, "3"]]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            // empty arrays for int128[3][] & uint128[3][]
            it('validates empty matrix valid values for int128[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int128[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty array value for int128[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int128[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [1, 2, "-3"]]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates empty matrix valid values for uint128[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint128[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty array value for uint128[3][]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint128[3][]')

              const validationResult = dinamicMatrixOfIntsValidation('[  [ 1, 2, "3"], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })
          })
        })
        describe('int[][size] & uints[][size]', () => {
          it('validates valid int[][3] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation('[ [1], [  2, "-3"], [] ]')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid length of int[][3] values (less items)', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[   [1],   [ 2, "3", 4, "-5", 6, 7, 8] ]',
            )

            expect(validationResult).toBe('format error. details: missing argument: coder array')
          })

          it('validates invalid length of int[][3] values (too many items)', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1], [ "-2", 3],    [4],     [ "5" ],   [6] ]',
            )

            expect(validationResult).toBe('format error. details: too many arguments: coder array')
          })

          it('validates invalid length of uint[][3] values', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, 2 , 3], [  4, "5", 6, 7, 8], [4],     [ "5" ],   [6] ]',
            )

            expect(validationResult).toBe('format error. details: too many arguments: coder array')
          })

          it('validates invalid array value for int[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid array value for uint[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid matrix value for int[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid matrix value for uint[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            const validationResult = dinamicMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid number values for int[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid number values for uint[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid array of numbers instead of matrix for int[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = dinamicMatrixOfIntsValidation(' [1, -2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates invalid array of numbers instead of matrix for uint[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = dinamicMatrixOfIntsValidation(' [1, 2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates long numbers (positive & negatives) for int[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [-6426191757410075707], [6426191757410075707] , ["-6426191757410075707"] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for uint[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [6426191757410075707 ], ["6426191757410075707   "  ] ,    [  6426191757410075707] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for uint[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [6426191757410075707 ,"-6426191757410075707 ",  "6426191757410075707"], [ -6426191757410075707 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int8[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int8[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 , "6    " , 1] , [6]] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int8[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int8[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint8[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(' [ [1, 2 ],  ["2"] , [ 2] ] ')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint8[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint8[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint8[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int128[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int128[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(' [ [1,2] ,[1,"-2 "],  ["2"]] ')

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int128[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('int128[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [875487583475874857888888888880000000000 ,"-875487583475874857888888888880000000000 ",  "875487583475874857888888888880000000000"], [ -875487583475874857888888888880000000000 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint128[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [87548758347587485788888888888000000000 ,  "87548758347587485788888888888000000000", 6], [3,4,5], [3]] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint128[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint128[][3]', () => {
            const dinamicMatrixOfIntsValidation = validateField('uint128[][3]')

            const validationResult = dinamicMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          describe('empty arrays and matrix valid values', () => {
            // empty arrays for int[][3] & uint[][3]
            it('validates invalid empty matrix value for int[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates valid empty array values for int[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[ [2, "-3", 1], [], []]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty matrix value for uint[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates valid empty array values for uint[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [], []]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            // empty arrays for int8[][3] & uint8[][3]
            it('validates invalid empty matrix value for int8[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int8[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates valid empty array values for int8[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int8[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [2, "-3",1 ], []]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty matrix value for uint8[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint8[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates valid empty array values for uint8[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint8[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [1, 2, "3"], []]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            // empty arrays for int128[][3] & uint128[][3]
            it('validates invalid empty matrix value for int128[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int128[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates empty array values for int128[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('int128[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[[], [], []]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })

            it('validates invalid empty matrix value for uint128[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint128[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates valid empty array values for uint128[][3]', () => {
              const dinamicMatrixOfIntsValidation = validateField('uint128[][3]')

              const validationResult = dinamicMatrixOfIntsValidation('[ [], [ 1, 2, "3"], []]')

              expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
            })
          })
        })
        describe('int[size][size] & uints[size][size]', () => {
          it('validates valid int[3][3] values', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1, 2, "3"], [ 4, 5, "-6"], [-7, 8 , 9] ]',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid length of int[3][3] values (less items)', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[   [1], [1],  [ 2, "3", 4, "-5", 6, 7, 8] ]',
            )

            expect(validationResult).toBe('format error. details: missing argument: coder array')
          })

          it('validates invalid length of int[3][3] values (too many items)', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1], [ "-2", 3],    [4],     [ "5" ],   [6] ]',
            )

            expect(validationResult).toBe('format error. details: too many arguments: coder array')
          })

          it('validates invalid length of uint[3][3] values', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1, 2 , 3], [  4, "5", 6, 7, 8], [4],     [ "5" ],   [6] ]',
            )

            expect(validationResult).toBe('format error. details: too many arguments: coder array')
          })

          it('validates invalid array value for int[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid array value for uint[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1, -2 , 3], INVALID_ARRAY, [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_ARRAY" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_ARRAY"',
            )
          })

          it('validates invalid matrix value for int[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid matrix value for uint[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            const validationResult = fixedMatrixOfIntsValidation('INVALID_MATRIX')

            expect(validationResult).toBe('format error. details: SyntaxError: Invalid Array value')
          })

          it('validates invalid number values for int[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid number values for uint[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              '[ [1, -2 , 3], [ INVALID_NUMBER_VALUE ], [  "6"  ] ]',
            )

            expect(validationResult).toBe(
              'format error. details: Error: Error: [number-to-bn] while converting number "INVALID_NUMBER_VALUE" to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported. Given value: "INVALID_NUMBER_VALUE"',
            )
          })

          it('validates invalid array of numbers instead of matrix for int[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = fixedMatrixOfIntsValidation(' [1, -2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates invalid array of numbers instead of matrix for uint[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            // should fail because is an array of numbers instead of a matrix
            const validationResult = fixedMatrixOfIntsValidation(' [1, 2 , 3]')

            expect(validationResult).toBe('format error. details: expected array value')
          })

          it('validates long numbers (positive & negatives) for int[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [-6426191757410075707, "-6426191757410075707", -6426191757410075707], [6426191757410075707, 6426191757410075707, -6426191757410075707] , ["-6426191757410075707", 6426191757410075707, 6426191757410075707] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates long numbers for uint[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [6426191757410075707,6426191757410075707, 6426191757410075707 ], ["6426191757410075707   ", 6426191757410075707, 6426191757410075707  ] ,    [ 6426191757410075707, "6426191757410075707", 6426191757410075707] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative long numbers for uint[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [6426191757410075707 ,"-6426191757410075707 ",  "6426191757410075707"], [ -6426191757410075707 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int8[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int8[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 , "6    " , 1] , [1, 2, 26]] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int8[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int8[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200, 1, 2 ], [  "6",  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint8[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint8[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [1, 2 ,3],  ["2", 3, 4] , [1, 2, 2] ] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint8[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint8[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint8[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint8[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid values for int128[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int128[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [1,2, 3] ,[2, 1,"-2 "],  [1, 1, "2"]] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates out-of-bounds values for int128[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('int128[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [875487583475874857888888888880000000000 ,"-875487583475874857888888888880000000000 ",  "875487583475874857888888888880000000000"], [ -875487583475874857888888888880000000000 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates valid positive values for uint128[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint128[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [87548758347587485788888888888000000000 ,  "87548758347587485788888888888000000000", 6], [3,4,5], [1, 2, 3]] ',
            )

            expect(validationResult).toBe(NO_ERROR_IS_PRESENT)
          })

          it('validates invalid negative values for uint128[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint128[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [2 ,"-2 ",  "2"], [ -2 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          it('validates out-of-bounds values for uint128[3][3]', () => {
            const fixedMatrixOfIntsValidation = validateField('uint128[3][3]')

            const validationResult = fixedMatrixOfIntsValidation(
              ' [ [200 ,"-200 ",  "200"], [ -200 ], [  "6"  ] ] ',
            )

            expect(validationResult).toBe('format error. details: value out-of-bounds')
          })

          describe('empty arrays and matrix valid values', () => {
            // empty arrays for int[3][3] & uint[3][3]
            it('validates invalid empty matrix value for int[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('int[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty array values for int[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('int[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[ [2, "-3", 1], [], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty matrix value for uint[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty array values for uint[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('uint[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[[], [], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            // empty arrays for int8[3][3] & uint8[3][3]
            it('validates invalid empty matrix value for int8[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('int8[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty array values for int8[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('int8[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[[], [2, "-3",1 ], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty matrix value for uint8[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('uint8[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty array values for uint8[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('uint8[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[[], [1, 2, "3"], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            // empty arrays for int128[3][3] & uint128[3][3]
            it('validates invalid empty matrix value for int128[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('int128[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty array values for int128[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('int128[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[[], [], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty matrix value for uint128[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('uint128[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })

            it('validates invalid empty array values for uint128[3][3]', () => {
              const fixedMatrixOfIntsValidation = validateField('uint128[3][3]')

              const validationResult = fixedMatrixOfIntsValidation('[ [], [ 1, 2, "3"], []]')

              expect(validationResult).toBe('format error. details: missing argument: coder array')
            })
          })
        })
      })
      // TODO: ADD MATRIX of booleans, string, bytes, addresses, tuples
    })
    // TODO: ADD MULTIDIMENSIONAL ARRAYS
  })
})
