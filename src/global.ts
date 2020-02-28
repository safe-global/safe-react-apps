import { createGlobalStyle } from "styled-components";
import Averta from './assets/fonts/Averta-normal.woff2';
import AvertaBold from './assets/fonts/Averta-ExtraBold.woff2';

const GlobalStyle = createGlobalStyle`
   @font-face {
        font-family: 'Averta';
        src: local('Averta'), local('Averta Bold'),
        url(${Averta}) format('woff2'),
        url(${AvertaBold}) format('woff');
    }
`;

export default GlobalStyle;