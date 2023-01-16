import { maxDecimals, minMaxValue, mustBeFloat } from '@/utils/validation'

describe('validation', () => {
  describe('mustBeFloat', () => {
    it('successfully validates integers', () => {
      expect(mustBeFloat('2')).toBeUndefined()
      expect(mustBeFloat('-0992')).toBeUndefined()
      expect(mustBeFloat('000001')).toBeUndefined()
      expect(mustBeFloat('-24')).toBeUndefined()
      expect(mustBeFloat('9999999999999')).toBeUndefined()
    })

    it('successfully validates floats', () => {
      expect(mustBeFloat('2.0001')).toBeUndefined()
      expect(mustBeFloat('-0000.992')).toBeUndefined()
      expect(mustBeFloat('000001.0242')).toBeUndefined()
      expect(mustBeFloat('-24.24')).toBeUndefined()
      expect(mustBeFloat('9999999999999.99999999999')).toBeUndefined()
    })

    it('invalidates non numbers', () => {
      expect(mustBeFloat('2.000whoopsie')).toBeDefined()
      expect(mustBeFloat("$&/(=)//`´#'+*~")).toBeDefined()
    })
  })
  describe('minMaxValue', () => {
    describe('with number boundaries', () => {
      it('successfuly validation with integers', () => {
        expect(minMaxValue(0, 100, '0')).toBeUndefined()
        expect(minMaxValue(0, 100, '1')).toBeUndefined()
        expect(minMaxValue(0, 100, '23')).toBeUndefined()
        expect(minMaxValue(0, 100, '99')).toBeUndefined()
        expect(minMaxValue(0, 100, '100')).toBeUndefined()
      })

      it('failed validation with integers', () => {
        expect(minMaxValue(0, 100, '-1')).toBeDefined()
        expect(minMaxValue(0, 100, '101')).toBeDefined()
      })

      it('successfuly validation with floats', () => {
        expect(minMaxValue(0, 100, '0.00001')).toBeUndefined()
        expect(minMaxValue(0, 100, '23.92424')).toBeUndefined()
        expect(minMaxValue(0, 100, '99.9999999')).toBeUndefined()
        expect(minMaxValue(0, 100, '100.0')).toBeUndefined()
      })

      it('failed validation with floats', () => {
        expect(minMaxValue(0, 100, '-1.991')).toBeDefined()
        expect(minMaxValue(0, 100, '-0.0001')).toBeDefined()
        expect(minMaxValue(0, 100, '100.000000000001')).toBeDefined()
      })
    })

    describe('with string boundaries', () => {
      it('successfuly validation with integers', () => {
        expect(minMaxValue('0', '100', '1')).toBeUndefined()
        expect(minMaxValue('0', '100', '23')).toBeUndefined()
        expect(minMaxValue('0', '100', '99')).toBeUndefined()
        expect(minMaxValue('0', '100', '100')).toBeUndefined()
      })

      it('failed validation with integers', () => {
        expect(minMaxValue('0', '100', '-1')).toBeDefined()
        expect(minMaxValue('0', '100', '101')).toBeDefined()
      })

      it('successfuly validation with floats', () => {
        expect(minMaxValue('0', '100', '0.00001')).toBeUndefined()
        expect(minMaxValue('0', '100', '23.92424')).toBeUndefined()
        expect(minMaxValue('0', '100', '99.9999999')).toBeUndefined()
        expect(minMaxValue('0', '100', '100.0')).toBeUndefined()
      })

      it('failed validation with floats', () => {
        expect(minMaxValue('0', '100', '-1.991')).toBeDefined()
        expect(minMaxValue('0', '100', '100.000000000001')).toBeDefined()
      })
    })
  })
  describe('maxDecimals', () => {
    it('no decimals are valid', () => {
      expect(maxDecimals('0', 4)).toBeUndefined()
      expect(maxDecimals('-20', 4)).toBeUndefined()
      expect(maxDecimals('1', 4)).toBeUndefined()
      expect(maxDecimals('9999999999999999999999', 4)).toBeUndefined()
    })

    it('less or equal decimals are valid', () => {
      expect(maxDecimals('0.1', 4)).toBeUndefined()
      expect(maxDecimals('0.123', 4)).toBeUndefined()
      expect(maxDecimals('0.1234', 4)).toBeUndefined()
    })

    it('too many decimals are invalid', () => {
      expect(maxDecimals('0.12345', 4)).toBeDefined()
      expect(maxDecimals('0.123456789101112131415', 4)).toBeDefined()
    })
  })
})
