import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Badge } from '@mui/material'
import type { BadgeProps } from '@mui/material'
import type { ReactElement } from 'react'

export const SelectedBadge = (props: BadgeProps): ReactElement => {
  return (
    <Badge
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      badgeContent={<CheckCircleIcon color="primary" />}
      sx={{ width: '100%' }}
      {...props}
    />
  )
}
