import { theme } from "@gnosis.pm/safe-react-components";
import merge from "lodash/merge";

const getCustomTheme = () =>
  merge(theme, {
    colors: {
      primary: "#02d396",
      primaryHover: "#00c58a",
      primaryLight: "#d5f6ed",

      secondary: "#966aed",
      secondaryHover: "#8253dd",
      secondaryLight: "ebe1fb",
    },
  });

export default getCustomTheme;
