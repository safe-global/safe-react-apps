import { createTheme } from "@mui/material"

import palette from "./colors"
import darkPalette from "./colors-dark"

declare module "@mui/material/styles" {
  interface Palette {
    safeGreen: Palette["primary"]
    safeGrey: Palette["primary"]
    border: Palette["primary"]
  }
  interface PaletteOptions {
    safeGreen: PaletteOptions["primary"]
    safeGrey: PaletteOptions["primary"]
    border: PaletteOptions["primary"]
  }

  interface PaletteColor {
    background?: string
  }
}

const initTheme = (darkMode: boolean) => {
  const colors = darkMode ? darkPalette : palette

  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      safeGrey: {
        main: "rgb(161, 163, 167)",
      },
      info: {
        main: "#5FDDFF",
      },
      success: {
        main: "#00B460",
      },
      warning: {
        main: "#FF8061",
      },
      ...colors,
    },
    typography: {
      fontFamily: "DM Sans, Roboto, sans-serif",
      h1: {
        fontSize: "2rem",
        fontWeight: "bold",
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: "bold",
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
      h4: {
        fontSize: "27px",
        fontWeight: "bold",
      },
      h5: {
        fontSize: "24px",
        fontWeight: "bold",
        color: colors.text.primary,
      },
      button: {
        textTransform: "none",
        fontWeight: "bold",
      },
      subtitle1: {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "24px",
      },
      subtitle2: {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "24px",
        color: colors.text.secondary,
      },
      caption: {
        fontSize: "12px",
        lineHeight: "16px",
        letterSpacing: "0.4px",
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            background: theme.palette.background.paper,
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: colors.background.default,
            color: colors.text.primary,
            fontSize: 12,
            paddingTop: "12px",
            paddingBottom: "8px",
            paddingLeft: "16px",
            paddingRight: "16px",
            maxWidth: "275px",
            boxShadow: "rgba(33, 48, 77, 0.1) 0px 0px 10px 0px",
          },
          arrow: {
            color: colors.text.primary,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          elevation: {
            zIndex: 2,
            color: colors.text.primary,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          light: {
            borderColor: "#EEEFF0",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          sizeLarge: {
            padding: "10px 40px",
          },
          contained: {
            border: "1px solid transparent",
            "&:hover": {
              backgroundColor: "transparent",
              border: "1px solid #121312",
              color: colors.primary.main,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            "&:hover": {
              color: "#12ff80",
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          img: {
            objectFit: "contain",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderColor: colors.primary.light,
            border: "1px solid",
            "&.Mui-expanded": {
              backgroundColor: colors.safeGreen.light,
              borderColor: colors.primary.main,
            },
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'DM Sans';
          font-display: swap;
          font-weight: 400;
          src: url('/safe-claiming-app/fonts/dm-sans-v11-latin-ext-regular.woff2') format('woff2');
        }
        @font-face {
          font-family: 'DM Sans';
          font-display: swap;
          font-weight: bold;
          src: url('/safe-claiming-app/fonts/dm-sans-v11-latin-ext-700.woff2') format('woff2');
        }`,
      },
    },
  })
}

export default initTheme
