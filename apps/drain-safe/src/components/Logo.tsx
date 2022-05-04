import React from 'react'
import styled from 'styled-components'

const IconImg = styled.img`
  margin-right: 10px;
  height: 3em;
  width: auto;
`

function Logo(): JSX.Element {
  return <IconImg src="./logo.svg" alt="logo" />
}

export default Logo
