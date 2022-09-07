import { createTheme } from "@mui/material"

declare module "@mui/material/styles" {
  interface Palette {
    safeGreen: Palette["primary"]
    safeGrey: Palette["primary"]
  }
  interface PaletteOptions {
    safeGreen: PaletteOptions["primary"]
    safeGrey: PaletteOptions["primary"]
  }
}

const theme = createTheme({
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
      color: "#B2BBC0",
    },
    subtitle2: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#B2BBC0",
    },
  },
  palette: {
    primary: {
      main: "#121312",
    },
    safeGreen: {
      main: "#12ff80",
      light: "#EFFFF4",
    },
    safeGrey: {
      main: "rgb(161, 163, 167)",
    },
    background: {
      default: "#F6F7F8",
      paper: "#FFFFFF",
    },
    secondary: {
      main: "#B2BBC0",
      light: "#92C9BE",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#121312",
          color: "#FFF",
          fontSize: 12,
          paddingTop: "12px",
          paddingBottom: "8px",
          paddingLeft: "16px",
          paddingRight: "16px",
          maxWidth: "275px",
          boxShadow: "rgba(33, 48, 77, 0.1) 0px 0px 10px 0px",
        },
        arrow: {
          color: "white",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation: {
          zIndex: 2,
          color: "#121312",
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
            color: "#121312",
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
          "&.Mui-expanded": {
            backgroundColor: "#EFFFF4",
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
          src: url('/fonts/dm-sans-v11-latin-ext-regular.woff2') format('woff2');
        }
        @font-face {
          font-family: 'DM Sans';
          font-display: swap;
          font-weight: bold;
          src: url('/fonts/dm-sans-v11-latin-ext-700.woff2') format('woff2');
        }`,
    },
  },
})

export default theme
