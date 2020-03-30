import { createGlobalStyle } from "styled-components";
import avertaFont from "@gnosis/safe-react-components/dist/fonts/averta-normal.woff2";
import avertaBoldFont from "@gnosis/safe-react-components/dist/fonts/averta-bold.woff2";

const GlobalStyle = createGlobalStyle`
   @font-face {
        font-family: 'Averta';
        src: local('Averta'), local('Averta Bold'),
        url(${avertaFont}) format('woff2'),
        url(${avertaBoldFont}) format('woff');
    }
`;

export default GlobalStyle;
