import { createGlobalStyle } from "styled-components";
//import Averta from './assets/fonts/Averta-normal.woff2';
//import AvertaBold from './assets/fonts/Averta-ExtraBold.woff2';
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
