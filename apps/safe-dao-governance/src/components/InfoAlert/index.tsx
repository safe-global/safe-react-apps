import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material'
import type { ReactElement } from 'react'

export const InfoAlert = ({ children, ...props }: BoxProps): ReactElement => {
  return (
    <Box display="flex" gap={1} color="text.secondary" {...props}>
      <InfoOutlined
        sx={{
          height: '16px',
          width: '16px',
          mt: ({ typography }) => {
            // @ts-expect-error - h6 is not defined in custom theme
            const lineHeight = typography[props.variant || 'body1']?.lineHeight
            return lineHeight ? `calc((${lineHeight} / 2) - 8px)` : undefined
          },
        }}
      />
      {children}
    </Box>
  )
}
