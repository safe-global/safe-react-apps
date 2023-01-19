import { Box } from '@mui/material'
import clsx from 'clsx'

import palette from '@/styles/colors'

import css from './styles.module.css'

export const Circle = ({ color, className }: { color: string; className: string }) => {
  return (
    <Box
      className={clsx(css.circle, className)}
      sx={{
        background: `radial-gradient(circle, ${color} 0%, rgb(246 247 248 / 0%) 70%)`,
      }}
    />
  )
}

export const TopCircle = () => {
  return <Circle color={palette.secondary.main} className={css.top} />
}

export const BottomCircle = () => {
  return <Circle color={palette.info.main} className={css.bottom} />
}
