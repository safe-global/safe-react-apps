import { useEffect, useMemo, useState } from "react"
import initTheme from "src/config/theme"

const isSystemDarkMode = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const useDarkMode = (): boolean => {
  const location = window.location

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const urlDarkMode = urlParams.get("theme")

    setIsDarkMode(urlDarkMode === "dark" || isSystemDarkMode())
  }, [location.hash, location.search])

  return isDarkMode
}

export const useLightDarkTheme = () => {
  const isDarkMode = useDarkMode()

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    )
  }, [isDarkMode])

  return useMemo(() => initTheme(isDarkMode), [isDarkMode])
}
