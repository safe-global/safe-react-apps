import { Box, styled } from "@mui/material"
import { createRef, useEffect, useMemo, useState } from "react"

// Percentage value
const radius = 40
const minSize = 20
const maxSize = 50
const varianceFactor = 4
const animationDuration = "90s"

const Orbit = styled(Box)`
  width: 1000px;
  height: 1000px;
  z-index: -1;
  margin: auto;
  opacity: 70%;
  overflow: visible;
  animation: 2s ease-in-out 1 grow,
    ${animationDuration} linear 2s infinite orbit;
  /* animation-iteration-count: 1, infinite;
  /* Tone down the animation to avoid vestibular motion triggers */
  @media (prefers-reduced-motion) {
    animation-name: none;
  }

  @keyframes grow {
    from {
      transform: scale(0.05);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes orbit {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const TileBox = styled(Box)`
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-delay: 2s;
  animation-name: anti-orbit;
  animation-duration: ${animationDuration};
  /* Tone down the animation to avoid vestibular motion triggers */
  @media (prefers-reduced-motion) {
    animation-name: none;
  }

  position: absolute;

  @keyframes anti-orbit {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-180deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`

const ScaleWrapper = styled("div")`
  position: absolute;
  transition: transform 1s ease-in;
  border-radius: 20%;
`

/**
 * Uses Box Muller transform to generate a 0,1 gaussian
 *
 */
const randomGaussian = () => {
  const u = 1 - Math.random()
  const v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

const randomPointOnCircle = () => {
  const angle = Math.random() * Math.PI * 2
  const adjustedRadius = radius + varianceFactor * randomGaussian()
  const x = Math.cos(angle) * adjustedRadius + 50
  const y = Math.sin(angle) * adjustedRadius + 50
  return [x, y]
}

type TileSpec = {
  top: string
  left: string
  size: string
}

const Tile = ({
  top,
  left,
  size,
  visible,
  startTime,
  color,
}: {
  top: string
  left: string
  size: string
  visible: boolean
  startTime: number | undefined | null
  color: string
}) => {
  const tileRef = createRef<HTMLElement>()

  useEffect(() => {
    const animation = tileRef.current?.getAnimations()[0]
    if (animation && startTime) {
      animation.startTime = startTime
    }
  }, [startTime, tileRef])

  return (
    <TileBox ref={tileRef} left={left} width={size} height={size} top={top}>
      <ScaleWrapper
        style={{
          width: "100%",
          height: "100%",
          transform: visible ? "scale(1)" : "scale(0)",
          backgroundColor: color,
        }}
      />
    </TileBox>
  )
}

export const FloatingTiles = ({
  // Number between 0 and 1
  progress,
  maxTiles,
  color,
}: {
  progress: number
  maxTiles: number
  color: string
}) => {
  const orbitRef = createRef<HTMLElement>()
  const [animationStartTime, setAnimationStartTime] = useState<number | null>()

  const tileSpec: TileSpec[] = useMemo(() => {
    return Array.apply("", Array(maxTiles)).map(() => {
      const [x, y] = randomPointOnCircle()

      const top = `${x.toFixed(2)}%`
      const left = `${y.toFixed(2)}%`

      const size = `${(Math.random() * (maxSize - minSize) + minSize).toFixed(
        2
      )}px`

      return {
        top,
        left,
        size,
      }
    })
  }, [maxTiles])

  useEffect(() => {
    setTimeout(() => {
      if (!animationStartTime) {
        setAnimationStartTime(orbitRef.current?.getAnimations()[0]?.startTime)
      }
    }, 0)
  }, [animationStartTime, orbitRef])

  const visibleTiles = useMemo(() => {
    const minTiles = Math.floor(maxTiles / 5)
    const progressTiles = maxTiles - minTiles
    return minTiles + Math.floor(progress * progressTiles)
  }, [progress, maxTiles])

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        zIndex: -1,
        backgroundColor: ({ palette }) => palette.background.default,
      }}
    >
      <Orbit ref={orbitRef}>
        {tileSpec.map((spec, idx) => (
          <Tile
            key={idx}
            {...spec}
            visible={idx < visibleTiles}
            startTime={animationStartTime}
            color={color}
          />
        ))}
      </Orbit>
    </Box>
  )
}
