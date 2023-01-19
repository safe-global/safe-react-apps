import { getNewPosition, getOffset, getStartPosition } from '@/components/Odometer/numberPosition'

describe('numberPositions', () => {
  it('getNewPosition should multiple number by -2 (em)', () => {
    expect(getNewPosition(5)).toEqual(-10)
    expect(getNewPosition(0)).toEqual(-0)
    expect(getNewPosition(9)).toEqual(-18)
  })

  describe('getStartPosition', () => {
    it('currentPosition is in top half and direction is increasing', () => {
      expect(getStartPosition(-4, 1)).toEqual(-4)
    })

    it('currentPosition is in top half and direction is decreasing', () => {
      expect(getStartPosition(-4, -1)).toEqual(-24)
    })

    it('currentPosition is in bottom half and direction is increasing', () => {
      expect(getStartPosition(-28, 1)).toEqual(-8)
    })

    it('currentPosition is in bottom half and direction is decreasing', () => {
      expect(getStartPosition(-28, -1)).toEqual(-28)
    })
  })

  describe('getOffset', () => {
    it('start is in top half, direction is increasing and next target is in top half', () => {
      expect(getOffset(-4, 8, 1)).toEqual(-12)
    })

    it('start is in top half, direction is increasing and next target is in bottom half', () => {
      expect(getOffset(-10, 4, 1)).toEqual(-18)
    })

    it('start is in bottom half, direction is decreasing and next target is in bottom half', () => {
      expect(getOffset(-38, 1, -1)).toEqual(16)
    })

    it('start is in bottom half, direction is decreasing and next target is in top half', () => {
      expect(getOffset(-24, 5, -1)).toEqual(14)
    })
  })
})
