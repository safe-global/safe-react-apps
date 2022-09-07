import styled from "@emotion/styled"
import { Box } from "@mui/material"
import { createContext, useContext, useRef, useState } from "react"

type ScrollContextType = {
  storeScrollPosition: () => void
  restoreScrollPosition: () => void
}

const ScrollContext = createContext<ScrollContextType>({
  storeScrollPosition() {
    // empty default
  },
  restoreScrollPosition() {
    // empty default
  },
})

const Wrapper = styled(Box)`
  background: transparent;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  align-items: center;
  overflow: auto;
  display: flex;
  justify-content: center;
`

export const ScrollContextProvider = ({
  children,
}: {
  children: JSX.Element
}) => {
  const scrollWrapperRef = useRef<HTMLElement>()
  const [storedScrollPosition, setStoredScrollPosition] = useState<number>()
  const storeScrollPosition = () =>
    setStoredScrollPosition(scrollWrapperRef.current?.scrollTop)

  const restoreScrollPosition = () =>
    setTimeout(
      () =>
        storedScrollPosition &&
        scrollWrapperRef.current?.scrollTo(0, storedScrollPosition)
    )

  return (
    <ScrollContext.Provider
      value={{
        storeScrollPosition,
        restoreScrollPosition,
      }}
    >
      <Wrapper ref={scrollWrapperRef}>{children}</Wrapper>
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => useContext(ScrollContext)
