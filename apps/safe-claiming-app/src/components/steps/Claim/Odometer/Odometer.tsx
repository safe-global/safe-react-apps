import { useEffect, useRef, useState } from "react"

import BezierEasing from "bezier-easing"
import { getNewPosition, getStartPosition, getOffset } from "./numberPosition"
import { formatAmount } from "src/utils/format"

const DURATION = 1000
const NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const easeInOut = BezierEasing(0.42, 0, 0.58, 1)

const roundNumber = (num: number, digits: number) => {
  const decimal = Math.pow(10, digits)
  return Math.round(num * decimal) / decimal
}

export const Odometer = ({
  value = 0,
  decimals = 2,
}: {
  value: number
  decimals: number
}) => {
  const [start, setStart] = useState(0)
  const [target, setTarget] = useState(0)

  useEffect(() => {
    setStart(target)
    setTarget(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const getDirection = () => target - start

  const renderNumbers = () => {
    const direction = getDirection()
    const valueString = formatAmount(value, decimals)
    const targetString = formatAmount(target, decimals).padStart(
      valueString.length,
      "0"
    )
    return targetString.split("").map((digit, idx) => {
      const targetDigit = digit || 0
      if (targetDigit === ".") {
        return <span key="decimal-separator">.</span>
      }
      if (targetDigit === ",") {
        return <span key="thousand-separator">,</span>
      }
      return (
        <RollingNumber
          key={`number-${idx}`}
          direction={direction}
          target={Number(targetDigit)}
        />
      )
    })
  }

  return (
    <div style={{ display: "flex", alignItems: "center", lineHeight: "2em" }}>
      {renderNumbers()}
    </div>
  )
}

const RollingNumber = ({
  direction,
  target,
}: {
  direction: number
  target: number
}) => {
  const targetRef = useRef<number>(1)

  const [currentPosition, setCurrentPosition] = useState(getNewPosition(target))

  useEffect(() => {
    if (targetRef.current === target) {
      // no new target.
      return
    }
    targetRef.current = target
    const startTime = new Date().getTime()
    const startPosition = roundNumber(
      getStartPosition(currentPosition, direction),
      3
    )
    const offset = getOffset(startPosition, target, direction)

    function tick() {
      const elapsed = new Date().getTime() - startTime
      // If the browser window is in the background / minimized it will optimize and not call the requestAnimationFrame until in foreground causing wrong numbers for progress.
      const progress = Math.min(elapsed / DURATION, 1)
      const easedProgress = easeInOut(progress)
      const position = startPosition + easedProgress * offset
      setCurrentPosition(roundNumber(position, 3))

      if (elapsed < DURATION && targetRef.current === target) {
        requestAnimationFrame(tick)
      }
    }

    tick()
  }, [direction, target, currentPosition])

  function renderDigits() {
    return NUMS.map((digit, idx) => <span key={`digit-${idx}`}>{digit}</span>)
  }

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ width: "1ch", height: "2em" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          width: "1ch",
          height: "2em",
          transform: `translateY(${currentPosition}em)`,
          pointerEvents: "none",
        }}
      >
        {renderDigits()}
      </div>
    </div>
  )
}
