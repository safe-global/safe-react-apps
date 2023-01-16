import { useTheme } from '@mui/material/styles'

export const useIsDarkMode = (): boolean => {
  const { palette } = useTheme()
  return palette.mode === 'dark'
}
