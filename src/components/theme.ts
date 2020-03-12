const theme = {
  fonts: {
    fontFamily: `'Averta', 'Roboto', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', sans-serif`,
    fontFamilyCode: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`
  },
  colors: {
    activeListItemBackground: "#fafafa",
    primary: "#00be95",
    primarySoft: "#A3F7E5",
    secondary: "#ff7848",
    secondarySoft: "#FFB59B",
    tertiary: "#f5f5f5",
    textColor: "#333",
    textColorLight: "#888"
  },
  buttons: {
    size: {
      xs: "50px",
      sm: "70px",
      md: "90px",
      lg: "90px",
      xl: undefined
    }
  },
  text: {
    size: {
      xs: {
        fontSize: "11px",
        lineHeight: "14px"
      },
      sm: {
        fontSize: "12px",
        lineHeight: "16px"
      },
      md: {
        fontSize: "14px",
        lineHeight: "20px"
      },
      lg: {
        fontSize: "16px",
        lineHeight: "22px"
      },
      xl: {
        fontSize: "20px",
        lineHeight: "26px"
      }
    }
  },
  icons: {
    size: {
      xs: "16px",
      sm: "24px",
      md: undefined,
      lg: undefined,
      xl: undefined
    }
  }
};

export type Theme = typeof theme;

export default theme;
