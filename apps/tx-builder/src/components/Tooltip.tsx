import { ReactElement } from 'react'
import MUITooltip, { TooltipProps as TooltipPropsMui } from '@material-ui/core/Tooltip'
import { withStyles, alpha, type Theme } from '@material-ui/core/styles'
import { BreakpointDefaults } from '@material-ui/core/styles/createBreakpoints'
import { PaletteColor } from '@material-ui/core/styles/createPalette'

type TooltipProps = {
  size?: keyof BreakpointDefaults
  backgroundColor?: keyof Theme['palette']
  textColor?: keyof Theme['palette']
  padding?: string
  border?: string
}

const getPaddingBySize = (size: keyof BreakpointDefaults): string => {
  switch (size) {
    case 'lg':
      return '8px 16px'
    default:
      return '4px 8px'
  }
}

const getBorderBySize = (size: keyof BreakpointDefaults): string => {
  switch (size) {
    case 'lg':
      return 'none'
    default:
      return `1px solid #B2B5B2`
  }
}

const getFontInfoBySize = (
  size: keyof BreakpointDefaults,
): {
  fontSize: string
  lineHeight: string
} => {
  switch (size) {
    case 'lg':
      return {
        fontSize: '14px',
        lineHeight: '20px',
      }
    default:
      return {
        fontSize: '12px',
        lineHeight: '16px',
      }
  }
}

const customTooltip = ({ backgroundColor, textColor, size = 'md' }: TooltipProps) =>
  withStyles(theme => ({
    popper: {
      zIndex: 2001,
    },
    tooltip: {
      backgroundColor:
        backgroundColor && theme.palette[backgroundColor]
          ? (theme.palette[backgroundColor] as PaletteColor).main
          : theme.palette.primary.main,
      boxShadow: `1px 2px 10px ${alpha('#28363D', 0.18)}`,
      border: getBorderBySize(size),
      color: textColor
        ? (theme.palette[textColor] as PaletteColor).main
        : theme.palette.background.default,
      borderRadius: '4px',
      fontFamily: theme.typography.fontFamily,
      padding: getPaddingBySize(size),
      fontSize: getFontInfoBySize(size).fontSize,
      lineHeight: getFontInfoBySize(size).lineHeight,
    },
    arrow: {
      color: backgroundColor ? (theme.palette[backgroundColor] as PaletteColor).main : '#E8E7E6',
      border: 'none',

      '&::before': {
        boxShadow: `1px 2px 10px ${alpha('#28363D', 0.18)}`,
      },
    },
  }))(MUITooltip)

type Props = {
  title: string
  children: ReactElement
} & TooltipProps

export const Tooltip = ({
  title,
  backgroundColor,
  textColor,
  children,
  size,
  ...rest
}: Props & TooltipPropsMui): ReactElement => {
  const StyledTooltip = customTooltip({
    backgroundColor,
    textColor,
    size,
  })

  return (
    <StyledTooltip title={title} {...rest}>
      {children}
    </StyledTooltip>
  )
}
