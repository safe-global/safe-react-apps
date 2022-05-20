import { isBN, toBN } from 'web3-utils'

import {
  getInputTypeHelper,
  parseBooleanValue,
  parseInputValue,
  parseStringOfIntsToArray,
} from './utils'

describe('util functions', () => {
  describe('parseInputValue', () => {
    describe('integer values', () => {
      describe('int values', () => {
        it('parse a valid positive int to BN', () => {
          const parsedValue = parseInputValue('int', '1')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('1'))
        })

        it('parse a valid negative int to BN', () => {
          const parsedValue = parseInputValue('int', '-1')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('-1'))
        })

        it('parse a valid long number to BN', () => {
          const parsedValue = parseInputValue('int', '6426191757410075707')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('6426191757410075707'))
        })

        it('parse a valid negative long number to BN', () => {
          const parsedValue = parseInputValue('int', '-6426191757410075707')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('-6426191757410075707'))
        })

        it('parse a valid hexadecimal value to BN', () => {
          const parsedValue = parseInputValue('int', 'aaaaffff')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('aaaaffff'))
        })
      })

      describe('uint values', () => {
        it('parse a valid positive uint to BN', () => {
          const parsedValue = parseInputValue('uint', '1')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('1'))
        })

        it('parse a negative uint to BN', () => {
          const parsedValue = parseInputValue('uint', '-1')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('-1'))
        })

        it('parse a valid long number to BN', () => {
          const parsedValue = parseInputValue('uint', '6426191757410075707')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('6426191757410075707'))
        })

        it('parse a negative long number to BN', () => {
          const parsedValue = parseInputValue('uint', '-6426191757410075707')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('-6426191757410075707'))
        })

        it('parse a valid hexadecimal value to BN', () => {
          const parsedValue = parseInputValue('uint', '0xaaaaffff')

          expect(isBN(parsedValue)).toBe(true)
          expect(parsedValue).toEqual(toBN('0xaaaaffff'))
        })
      })

      describe('uintX and intX values', () => {
        it('parse a valid positive fixed size uint and int values to BN', () => {
          // uint256
          expect(isBN(parseInputValue('uint256', '1'))).toBe(true)
          expect(parseInputValue('uint256', '1')).toEqual(toBN('1'))

          // int256
          expect(isBN(parseInputValue('int256', '1'))).toBe(true)
          expect(parseInputValue('int256', '1')).toEqual(toBN('1'))

          // uint8
          expect(isBN(parseInputValue('uint8', '1'))).toBe(true)
          expect(parseInputValue('uint8', '1')).toEqual(toBN('1'))

          // int8
          expect(isBN(parseInputValue('int8', '1'))).toBe(true)
          expect(parseInputValue('int8', '1')).toEqual(toBN('1'))

          // uint64
          expect(isBN(parseInputValue('uint64', '1'))).toBe(true)
          expect(parseInputValue('uint64', '1')).toEqual(toBN('1'))

          // int64
          expect(isBN(parseInputValue('int64', '1'))).toBe(true)
          expect(parseInputValue('int64', '1')).toEqual(toBN('1'))

          // uint120
          expect(isBN(parseInputValue('uint120', '1'))).toBe(true)
          expect(parseInputValue('uint120', '1')).toEqual(toBN('1'))

          // int120
          expect(isBN(parseInputValue('int120', '1'))).toBe(true)
          expect(parseInputValue('int120', '1')).toEqual(toBN('1'))
        })
      })
    })

    describe('boolean values', () => {
      it('parse a valid "true" string to boolean', () => {
        const parsedValue = parseInputValue('bool', 'true')

        expect(parsedValue).toBe(true)
      })

      it('parse a valid "True" string to boolean', () => {
        const parsedValue = parseInputValue('bool', 'True')

        expect(parsedValue).toBe(true)
      })

      it('parse a valid "TRUE" string to boolean', () => {
        const parsedValue = parseInputValue('bool', 'TRUE')

        expect(parsedValue).toBe(true)
      })

      it('parse a valid "1" string to boolean', () => {
        const parsedValue = parseInputValue('bool', '1')

        expect(parsedValue).toBe(true)
      })

      it('parse a valid "false" string to boolean', () => {
        const parsedValue = parseInputValue('bool', 'false')

        expect(parsedValue).toBe(false)
      })

      it('parse a valid "False" string to boolean', () => {
        const parsedValue = parseInputValue('bool', 'False')

        expect(parsedValue).toBe(false)
      })

      it('parse a valid "FALSE" string to boolean', () => {
        const parsedValue = parseInputValue('bool', 'FALSE')

        expect(parsedValue).toBe(false)
      })

      it('parse a valid "0" string to boolean', () => {
        const parsedValue = parseInputValue('bool', '0')

        expect(parsedValue).toBe(false)
      })

      it.skip('parse an invalid boolean "invalid_bool_value" string to boolean', () => {
        // FIX: pased as false instead of throw SyntaxError
        expect(() => parseInputValue('bool', 'invalid_bool_value')).toThrow(SyntaxError)
      })
    })

    describe('address values', () => {
      it('valid address', () => {
        const parsedValue = parseInputValue('address', '0x680cde08860141F9D223cE4E620B10Cd6741037E')

        expect(parsedValue).toBe('0x680cde08860141F9D223cE4E620B10Cd6741037E')
      })

      it('invalid address', () => {
        const parsedValue = parseInputValue('address', 'INVALID_ADDRESS')

        expect(parsedValue).toBe('INVALID_ADDRESS')
      })
    })

    describe('bytes values', () => {
      it('for valid bytes', () => {
        const parsedValue = parseInputValue('bytes', '0x00000111111')

        expect(parsedValue).toBe('0x00000111111')
      })

      it('invalid bytes', () => {
        const parsedValue = parseInputValue('bytes', 'INVALID_BYTES')

        expect(parsedValue).toBe('INVALID_BYTES')
      })
    })

    describe('bool[] & bool[size] values', () => {
      it('parse a valid truthy values to variable-length array of booleans', () => {
        const parsedValue = parseInputValue('bool[]', '[true, "true", "True", "TRUE", 1]')

        expect(parsedValue).toEqual([true, true, true, true, true])
      })

      it('parse a valid truthy values to fixed-length array of booleans', () => {
        const parsedValue = parseInputValue('bool[5]', '[true, "true", "True", "TRUE", 1]')

        expect(parsedValue).toEqual([true, true, true, true, true])
      })

      it('parse a valid falsy values to variable-length array of booleans', () => {
        const parsedValue = parseInputValue('bool[]', '[false, "false", "False", "FALSE", 0]')

        expect(parsedValue).toEqual([false, false, false, false, false])
      })

      it('parse a valid falsy values to fixed-length array of booleans', () => {
        const parsedValue = parseInputValue('bool[5]', '[false, "false", "False", "FALSE", 0]')

        expect(parsedValue).toEqual([false, false, false, false, false])
      })

      it('parse empty array', () => {
        const parsedValue = parseInputValue('bool[]', '[]')

        expect(parsedValue).toEqual([])
      })

      it('throws an error for invalid array value', () => {
        expect(() => parseInputValue('bool[]', 'INVALID ARRAY')).toThrow(SyntaxError)
      })

      it('throws an error for an array of invalid values', () => {
        expect(() => parseInputValue('bool[]', '[invalid_bool_value]')).toThrow(SyntaxError)
      })

      it.skip('throws an error for an array of invalid strings', () => {
        // FIX: pased as [false] instead of throw SyntaxError
        expect(() => parseInputValue('bool[]', '["invalid_bool_value"]')).toThrow(SyntaxError)
      })
    })

    describe('int[], uint, int[size] & uint[size] values', () => {
      describe(' int[] & int[size]', () => {
        it('parse an array of numbers to array of strings', () => {
          expect(parseInputValue('int[]', '[1]')).toEqual(['1'])
          expect(parseInputValue('int[2]', '[1]')).toEqual(['1'])
        })

        it('parse an array of numbers as strings to array of strings', () => {
          expect(parseInputValue('int[]', '["1"]')).toEqual(['1'])
          expect(parseInputValue('int[2]', '["1"]')).toEqual(['1'])
        })

        it('parse an array of long numbers to array of strings', () => {
          expect(parseInputValue('int[]', '[6426191757410075707]')).toEqual(['6426191757410075707'])
          expect(parseInputValue('int[4]', '[6426191757410075707]')).toEqual([
            '6426191757410075707',
          ])
        })

        it('parse an array of long numbers as strings to array of strings', () => {
          expect(parseInputValue('int[]', '["6426191757410075707"]')).toEqual([
            '6426191757410075707',
          ])
          expect(parseInputValue('int[3]', '["6426191757410075707"]')).toEqual([
            '6426191757410075707',
          ])
        })

        it('parse an empty array as valid value', () => {
          expect(parseInputValue('int[]', '[]')).toEqual([])
          expect(parseInputValue('int[2]', '[]')).toEqual([])
        })

        it('parse an invalid array value throws a SyntaxError', () => {
          expect(() => parseInputValue('int[]', 'invalid_array_value')).toThrow(SyntaxError)
          expect(() => parseInputValue('int[]', '6426191757410075707')).toThrow(SyntaxError)
          expect(() => parseInputValue('int[]', '[invalid_array_value]')).toThrow(SyntaxError)
          expect(() => parseInputValue('int[3]', 'invalid_array_value')).toThrow(SyntaxError)
          expect(() => parseInputValue('int[3]', '6426191757410075707')).toThrow(SyntaxError)
          expect(() => parseInputValue('int[2]', '[invalid_array_value]')).toThrow(SyntaxError)
        })
      })

      describe('uint[] & uint[size]', () => {
        it('parse an array of numbers to array of strings', () => {
          expect(parseInputValue('uint[]', '[1]')).toEqual(['1'])
          expect(parseInputValue('uint[2]', '[1]')).toEqual(['1'])
        })

        it('parse an array of numbers as strings to array of strings', () => {
          expect(parseInputValue('uint[]', '["1"]')).toEqual(['1'])
          expect(parseInputValue('uint[2]', '["1"]')).toEqual(['1'])
        })

        it('parse an array of long numbers to array of strings', () => {
          expect(parseInputValue('uint[]', '[6426191757410075707]')).toEqual([
            '6426191757410075707',
          ])
          expect(parseInputValue('uint[4]', '[6426191757410075707]')).toEqual([
            '6426191757410075707',
          ])
        })

        it('parse an array of long numbers as strings to array of strings', () => {
          expect(parseInputValue('uint[]', '["6426191757410075707"]')).toEqual([
            '6426191757410075707',
          ])
          expect(parseInputValue('uint[3]', '["6426191757410075707"]')).toEqual([
            '6426191757410075707',
          ])
        })

        it('parse an empty array as valid value', () => {
          expect(parseInputValue('uint[]', '[]')).toEqual([])
          expect(parseInputValue('uint[2]', '[]')).toEqual([])
        })

        it('parse an invalid array value throws a SyntaxError', () => {
          expect(() => parseInputValue('uint[]', 'invalid_array_value')).toThrow(SyntaxError)
          expect(() => parseInputValue('uint[]', '6426191757410075707')).toThrow(SyntaxError)
          expect(() => parseInputValue('uint[]', '[invalid_array_value]')).toThrow(SyntaxError)
          expect(() => parseInputValue('uint[3]', 'invalid_array_value')).toThrow(SyntaxError)
          expect(() => parseInputValue('uint[3]', '6426191757410075707')).toThrow(SyntaxError)
          expect(() => parseInputValue('uint[2]', '[invalid_array_value]')).toThrow(SyntaxError)
        })
      })
    })

    describe('address[] & address[size] values', () => {
      it('parse an array of addresses to array of strings', () => {
        expect(
          parseInputValue('address[]', '["0x680cde08860141F9D223cE4E620B10Cd6741037E"]'),
        ).toEqual(['0x680cde08860141F9D223cE4E620B10Cd6741037E'])
        expect(
          parseInputValue('address[1]', '["0x680cde08860141F9D223cE4E620B10Cd6741037E"]'),
        ).toEqual(['0x680cde08860141F9D223cE4E620B10Cd6741037E'])
      })

      it('parse an invalid array value throws a SyntaxError', () => {
        // FIX: try to parse this valid value
        expect(() =>
          parseInputValue('address[]', '[0x680cde08860141F9D223cE4E620B10Cd6741037E]'),
        ).toThrow(SyntaxError)
        expect(() =>
          parseInputValue('address[1]', '[0x680cde08860141F9D223cE4E620B10Cd6741037E]'),
        ).toThrow(SyntaxError)
      })

      it('parse an invalid array value throws a SyntaxError', () => {
        expect(() => parseInputValue('address[]', '[INVALID_ADDRESS]')).toThrow(SyntaxError)
        expect(() => parseInputValue('address[1]', '[INVALID_ADDRESS]')).toThrow(SyntaxError)
        expect(() => parseInputValue('address[]', 'INVALID_ARRAY')).toThrow(SyntaxError)
        expect(() => parseInputValue('address[1]', 'INVALID_ARRAY')).toThrow(SyntaxError)
      })
    })

    describe('bytes[] & bytes[size] values', () => {
      it('parse an array of bytes to array of strings', () => {
        expect(parseInputValue('bytes[]', '["0x000111AAFF"]')).toEqual(['0x000111AAFF'])
        expect(parseInputValue('bytes[1]', '["0x000111AAFF"]')).toEqual(['0x000111AAFF'])
      })

      it('parse an invalid array of bytes throws a SyntaxError', () => {
        expect(() => parseInputValue('bytes[]', '[INVALID_BYTES]')).toThrow(SyntaxError)
        expect(() => parseInputValue('bytes[1]', '[INVALID_BYTES]')).toThrow(SyntaxError)
        expect(() => parseInputValue('bytes[]', 'INVALID_ARRAY')).toThrow(SyntaxError)
        expect(() => parseInputValue('bytes[1]', 'INVALID_ARRAY')).toThrow(SyntaxError)
        // FIX: try to parse this valid value
        expect(() => parseInputValue('bytes[]', '[0x000111AAFF]')).toThrow(SyntaxError)
        expect(() => parseInputValue('bytes[1]', '[0x000111AAFF]')).toThrow(SyntaxError)
      })
    })

    describe('tuple values', () => {
      it('tuples values are parsed as JSON', () => {
        const tupleFieldType = getInputTypeHelper({
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

        // tupleFieldType is tuple(uint128,uint128)
        expect(parseInputValue(tupleFieldType, '["1","1"]')).toEqual(['1', '1'])
        expect(parseInputValue(tupleFieldType, '[1,1]')).toEqual([1, 1])
      })

      it('parses a tuple with nested tuples', () => {
        const tupleWithNestedTuplesFieldType = getInputTypeHelper({
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

        // tuple(uint256,uint256[],tuple(uint256,uint256,tuple(uint256,uint256))[])

        expect(
          parseInputValue(tupleWithNestedTuplesFieldType, '[1,[2,3],[[3,3,[5,5]],[4,4,[6,6]]]]'),
        ).toEqual([
          1,
          [2, 3],
          [
            [3, 3, [5, 5]],
            [4, 4, [6, 6]],
          ],
        ])
      })

      it.skip('tuples with long int values are parsed to valid BN values', () => {
        const tupleFieldType = getInputTypeHelper({
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

        // tupleFieldType is tuple(uint128,uint128)
        expect(
          parseInputValue(tupleFieldType, '["6426191757410075707","6426191757410075707"]'),
        ).toEqual(['6426191757410075707', '6426191757410075707'])
        // FIX: fix this issue
        expect(
          parseInputValue(tupleFieldType, '[6426191757410075707,6426191757410075707]'),
        ).toEqual(['6426191757410075707', '6426191757410075707'])
      })

      it.skip('parses a tuple with nested tuples with long int values', () => {
        const tupleWithNestedTuplesFieldType = getInputTypeHelper({
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

        // tuple(uint256,uint256[],tuple(uint256,uint256,tuple(uint256,uint256))[])
        // FIX: fix this issue
        expect(
          parseInputValue(
            tupleWithNestedTuplesFieldType,
            '[6426191757410075707,[6426191757410075707,6426191757410075707],[[6426191757410075707,6426191757410075707,[6426191757410075707,6426191757410075707]],[6426191757410075707,6426191757410075707,[6426191757410075707,6426191757410075707]]]]',
          ),
        ).toEqual([
          '6426191757410075707',
          ['6426191757410075707', '6426191757410075707'],
          [
            [
              '6426191757410075707',
              '6426191757410075707',
              ['6426191757410075707', '6426191757410075707'],
            ],
            [
              '6426191757410075707',
              '6426191757410075707',
              ['6426191757410075707', '6426191757410075707'],
            ],
          ],
        ])
      })
    })

    describe('tuple[] values', () => {
      it('parse a valid tuple[] value', () => {
        const tupleArrayFieldType = getInputTypeHelper({
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

        // tuple(address,address,uint256)[]
        const parsedValue = parseInputValue(
          tupleArrayFieldType,
          '[["0x57CB13cbef735FbDD65f5f2866638c546464E45F", "0x57CB13cbef735FbDD65f5f2866638c546464E45F", 1], ["0x57CB13cbef735FbDD65f5f2866638c546464E45F", "0x57CB13cbef735FbDD65f5f2866638c546464E45F", 1]]',
        )

        expect(parsedValue).toEqual([
          [
            '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
            '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
            1,
          ],
          [
            '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
            '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
            1,
          ],
        ])
      })
    })
  })

  describe('parseStringOfIntsToArray', () => {
    it('parse valid string of ints to an array of strings', () => {
      const arrayAsString = '[0, 1,  2  ,  3,4  , " 5 ", -6 , "-7"]'
      const arrayPased = parseStringOfIntsToArray(arrayAsString)
      expect(arrayPased).toEqual(['0', '1', '2', '3', '4', '"5"', '-6', '"-7"'])
    })

    it('parse valid string of long ints to an array of strings', () => {
      const arrayAsString =
        '[6426191757410075707, -6426191757410075707, "6426191757410075707", "-6426191757410075707"]'
      const arrayPased = parseStringOfIntsToArray(arrayAsString)
      expect(arrayPased).toEqual([
        '6426191757410075707',
        '-6426191757410075707',
        '"6426191757410075707"',
        '"-6426191757410075707"',
      ])
    })

    it('parse a valid of nested array of ints to an array of strings', () => {
      const nestedArrayAsString = '[1, 2, [3,4], [  [5,6, [], 7]  ],  8, [9]]'
      const arrayPased = parseStringOfIntsToArray(nestedArrayAsString)
      expect(arrayPased).toEqual(['1', '2', '[3,4]', '[[5,6,[],7]]', '8', '[9]'])
    })
  })

  describe('parseBooleanValue', () => {
    it('parse a valid truthy boolean values as true', () => {
      expect(parseBooleanValue('true')).toBe(true)
      expect(parseBooleanValue('True')).toBe(true)
      expect(parseBooleanValue('TRUE')).toBe(true)
      expect(parseBooleanValue('1')).toBe(true)
      expect(parseBooleanValue(1)).toBe(true)
      expect(parseBooleanValue(true)).toBe(true)
    })

    it('parse a valid falsy boolean values as false', () => {
      expect(parseBooleanValue('false')).toBe(false)
      expect(parseBooleanValue('False')).toBe(false)
      expect(parseBooleanValue('FALSE')).toBe(false)
      expect(parseBooleanValue('0')).toBe(false)
      expect(parseBooleanValue(0)).toBe(false)
      expect(parseBooleanValue(false)).toBe(false)
    })

    it('another value throws an error', () => {
      expect(() => parseBooleanValue('another value')).toThrow(SyntaxError)
    })
  })
})
