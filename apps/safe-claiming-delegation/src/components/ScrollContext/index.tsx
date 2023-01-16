/* eslint-disable @typescript-eslint/no-empty-function */

import { createContext, useContext, useRef } from 'react'

type ScrollContextType = {
  storeScrollPosition: () => void
  restoreScrollPosition: () => void
}

const ScrollContext = createContext<ScrollContextType>({
  storeScrollPosition: () => {},
  restoreScrollPosition: () => {},
})

export const ScrollContextProvider = ({ children }: { children: JSX.Element }) => {
  const scrollPosition = useRef<number>()

  const storeScrollPosition = () => {
    scrollPosition.current = document.documentElement.scrollTop
  }

  const restoreScrollPosition = () => {
    if (scrollPosition.current) {
      // Scroll in next frame to avoid scroll position being reset
      setTimeout(() => {
        document.documentElement.scrollTo({ top: scrollPosition.current })
      })
    }
  }

  return (
    <ScrollContext.Provider
      value={{
        storeScrollPosition,
        restoreScrollPosition,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => {
  const stepperContext = useContext(ScrollContext)

  if (!stepperContext) {
    throw new Error('useScrollContext must be used within a ScrollContextProvider')
  }

  return stepperContext
}
