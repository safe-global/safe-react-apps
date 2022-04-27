import { createGlobalStyle } from 'styled-components'
import avertaFont from '@gnosis.pm/safe-react-components/dist/fonts/averta-normal.woff2'
import avertaBoldFont from '@gnosis.pm/safe-react-components/dist/fonts/averta-bold.woff2'

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%
    }

    body {
       height: 100%;
       margin: 0px;
       padding: 0px;
       background-color: #F6F6F6;
    }

    #root {
        height: 100%;
    }

    @font-face {
        font-family: 'Averta';
        src: local('Averta'), local('Averta Bold'),
        url(${avertaFont}) format('woff2'),
        url(${avertaBoldFont}) format('woff');
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active {
        box-shadow: 0 0 0 30px white inset !important;
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }

    && {
        .MuiButton-root {
            height: 46px !important;
        }
    
        .MuiFormControl-root  {
            min-height: 82px;
            margin-bottom: 0;
        }

        .MuiTooltip-tooltip {
            border: 0 !important;
        }
    }

    * {
        scrollbar-width: thin;
        scrollbar-color: #B2BBC0 #f6f6f6;
    }

    *::-webkit-scrollbar {
        width: 5px;
    }

    *::-webkit-scrollbar-track {
        background: #f6f6f6;
    }

    *::-webkit-scrollbar-thumb {
        background-color: #B2BBC0;
        border-radius: 20px;
        border: 3px solid #B2BBC0;
    }
`

export default GlobalStyle
