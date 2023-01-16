import { createTheme } from '@mui/material/styles'
import type { Shadows } from '@mui/material/styles'

import palette from '@/styles/colors'
import darkPalette from '@/styles/colors-dark'
import { base } from '@/styles/spacings'

declare module '@mui/material/styles' {
  // Custom color palettes
  interface Palette {
    border: Palette['primary']
    logo: Palette['primary']
    backdrop: Palette['primary']
    static: Palette['primary']
  }
  interface PaletteOptions {
    border: PaletteOptions['primary']
    logo: PaletteOptions['primary']
    backdrop: PaletteOptions['primary']
    static: PaletteOptions['primary']
  }

  interface TypeBackground {
    main: string
    light: string
  }

  // Custom color properties
  interface PaletteColor {
    background?: string
  }
  interface SimplePaletteColorOptions {
    background?: string
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    // SvgIconPropsColorOverrides['primary'] doesn't work
    border: unknown
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    danger: true
  }
  interface ButtonPropsSizeOverrides {
    stretched: true
  }
}

const initTheme = (darkMode: boolean) => {
  const colors = darkMode ? darkPalette : palette
  const shadowColor = colors.primary.light

  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...colors,
    },
    spacing: base,
    shape: {
      borderRadius: 6,
    },
    shadows: [
      'none',
      darkMode
        ? `0 0 2px ${shadowColor}`
        : `0 1px 4px ${shadowColor}0a, 0 4px 10px ${shadowColor}14`,
      darkMode
        ? `0 0 2px ${shadowColor}`
        : `0 1px 4px ${shadowColor}0a, 0 4px 10px ${shadowColor}14`,
      darkMode
        ? `0 0 2px ${shadowColor}`
        : `0 2px 20px ${shadowColor}0a, 0 8px 32px ${shadowColor}14`,
      darkMode
        ? `0 0 2px ${shadowColor}`
        : `0 8px 32px ${shadowColor}0a, 0 24px 60px ${shadowColor}14`,
      ...Array(20).fill('none'),
    ] as Shadows,
    typography: {
      fontFamily: 'DM Sans, sans-serif',
      h1: {
        fontSize: '32px',
        lineHeight: '36px',
        fontWeight: 700,
      },
      h2: {
        fontSize: '27px',
        lineHeight: '34px',
        fontWeight: 700,
      },
      h3: {
        fontSize: '24px',
        lineHeight: '30px',
      },
      h4: {
        fontSize: '20px',
        lineHeight: '26px',
      },
      h5: {
        fontSize: '16px',
        fontWeight: 700,
      },
      body1: {
        fontSize: '16px',
        lineHeight: '22px',
      },
      body2: {
        fontSize: '14px',
        lineHeight: '20px',
      },
      caption: {
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
      },
      overline: {
        fontSize: '11px',
        lineHeight: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      },
    },
    components: {
      MuiButton: {
        variants: [
          {
            props: { size: 'stretched' },
            style: {
              padding: '12px 48px',
            },
          },
          {
            props: { variant: 'danger' },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.error.background,
              color: theme.palette.error.main,
              '&:hover': {
                color: theme.palette.error.dark,
                backgroundColor: theme.palette.error.light,
              },
            }),
          },
        ],
        styleOverrides: {
          sizeSmall: {
            fontSize: '14px',
            padding: '8px 24px',
          },
          sizeMedium: {
            fontSize: '16px',
            padding: '12px 24px',
          },
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            fontWeight: 'bold',
            lineHeight: 1.25,
            borderColor: theme.palette.primary.main,
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }),
          outlined: {
            border: '2px solid',
            '&:hover': {
              border: '2px solid',
            },
          },
          sizeLarge: { fontSize: '16px' },
        },
      },
      MuiPaper: {
        variants: [
          {
            props: { variant: 'outlined' },
            style: {
              borderWidth: '1px',
            },
          },
        ],
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          outlined: ({ theme }) => ({
            borderWidth: 2,
            borderColor: theme.palette.border.light,
          }),
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            backgroundImage: 'none',
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: ({ theme }) => ({
            borderColor: theme.palette.border.main,
          }),
          root: ({ theme }) => ({
            borderColor: theme.palette.border.main,
          }),
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          fontSizeSmall: {
            width: '1rem',
            height: '1rem',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            ...theme.typography.body2,
            color: theme.palette.background.main,
            backgroundColor: theme.palette.text.primary,
          }),
          arrow: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontWeight: 700,
            '&:hover': {
              color: theme.palette.primary.light,
            },
          }),
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.border.light,
          }),
        },
      },
    },
  })
}

export default initTheme
