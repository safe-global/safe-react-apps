import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%
        font-family: 'DM Sans', sans-serif;
    }

    body {
       height: 100%;
       margin: 0px;
       padding: 0px;
       background-color: #f6f6f6;
       font-family: 'DM Sans', sans-serif;
    }

    #root {
        height: 100%;
        padding-right: 0.5rem;
    }

    .MuiFormControl-root,
    .MuiInputBase-root {
        width: 100% !important;
    }

`

export default GlobalStyle
