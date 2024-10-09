import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, alpha } from '@material-ui/core/styles'
import { type Theme } from '@material-ui/core/styles'

import { Typography, TypographyProps } from '@material-ui/core'
import styled from 'styled-components'

type Props = {
  children: React.ReactNode
  tooltip?: string
  color?: keyof Theme['palette'] | 'white'
  className?: string
  component?: 'span' | 'p'
  strong?: boolean
  center?: boolean
}

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: `0px 0px 10px ${alpha('#28363D', 0.2)}`,
  },
  arrow: {
    color: theme.palette.common.white,
    boxShadow: 'transparent',
  },
}))(Tooltip)

const StyledTypography = styled(Typography)<{ $color?: keyof Theme['palette'] | 'white' } & Props>`
  color: ${({ $color, theme }) =>
    $color
      ? $color === 'white'
        ? theme.palette.common.white
        : theme.palette[$color].main
      : theme.palette.text.primary};

  ${({ center }) => center && 'text-align: center;'}

  ${({ strong }) => strong && `font-weight: bold;`}
`

const Text = ({
  children,
  component = 'p',
  tooltip,
  color,
  ...rest
}: Props & Omit<TypographyProps, 'color'>): React.ReactElement => {
  const TextElement = (
    <StyledTypography $color={color} component={component} {...rest}>
      {children}
    </StyledTypography>
  )

  return tooltip === undefined ? (
    TextElement
  ) : (
    <StyledTooltip title={tooltip} placement="bottom" arrow>
      {TextElement}
    </StyledTooltip>
  )
}

export default Text
