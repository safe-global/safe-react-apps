import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    html {
        font-family: 'DM Sans, Roboto, sans-serif';
        height: 100%
    }

    body {
       height: 100%;
       margin: 0px;
       padding: 0px;
    }

    #root {
        height: 100%;
        background-color: #f3f5f6
    }

    @font-face {
        font-family: 'DM Sans';
        src: local('DM Sans'), url("./fonts/dm-sans-v11-latin-ext-regular.woff2") format('woff2')        
    }

    @font-face {
        font-family: 'DM Sans';
        src: local('DM Sans'), url("./fonts/dm-sans-v11-latin-ext-700.woff2") format('woff2');
        font-weight: bold;
    }
`

export default GlobalStyle
