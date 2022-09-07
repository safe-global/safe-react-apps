const FULL_LENGTH = -20

/**
 * Moves the start position to the correct half.
 */
export const getStartPosition = (currentPosition: number, direction: number) =>
  (currentPosition % FULL_LENGTH) + (direction >= 0 ? 0 : FULL_LENGTH)

export const getOffset = (start: number, target: number, direction: number) => {
  const newPosition = getNewPosition(target)
  const diff = (newPosition - start) % FULL_LENGTH
  return diff > 0 && direction > 0 ? diff + FULL_LENGTH : diff
}

export const getNewPosition = (target: number) => {
  return target * -2
}
