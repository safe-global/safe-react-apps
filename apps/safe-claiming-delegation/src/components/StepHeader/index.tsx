import { Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'
import type { ReactNode, ReactElement } from 'react'

import { AppRoutes } from '@/config/routes'

export const StepHeader = ({ title }: { title: ReactNode }): ReactElement => {
  const router = useRouter()

  const onClose = () => {
    router.push(AppRoutes.index)
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h2">{title}</Typography>

      <IconButton onClick={onClose}>
        <CloseIcon color="primary" fontSize="medium" />
      </IconButton>
    </Box>
  )
}
