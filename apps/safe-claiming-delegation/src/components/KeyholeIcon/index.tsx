import { Badge, Box, SvgIcon } from '@mui/material'
import type { BadgeProps } from '@mui/material'

import Keyhole from '@/public/images/keyhole.svg'

import css from './styles.module.css'

export const KeyholeIcon = ({
  size = 40,
  badgeColor,
}: {
  size?: number
  badgeColor?: BadgeProps['color']
}) => {
  return (
    <Badge
      color={badgeColor}
      overlap="circular"
      variant="dot"
      invisible={!badgeColor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      className={css.badge}
    >
      <Box className={css.circle} width={size} height={size}>
        <SvgIcon
          component={Keyhole}
          inheritViewBox
          sx={{
            height: size / 2,
            width: size / 2,
            '& path': {
              fill: ({ palette }) => palette.primary.light,
            },
          }}
        />
      </Box>
    </Badge>
  )
}
