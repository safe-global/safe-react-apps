import { Box, type BoxProps } from "@mui/material"

export const SpaceContent = (props: BoxProps) => {
  return (
    <Box
      {...props}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="300px"
      padding="24px"
    />
  )
}
