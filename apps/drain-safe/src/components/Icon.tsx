import React, { useState } from 'react'
import styled from 'styled-components'

interface Props {
  logoUri: string | null
  symbol: string
}

const IconImg = styled.img`
  margin-right: 10px;
  height: 1.5em;
  width: auto;
`

const defaultIcon = './question.svg'

function Icon(props: Props): JSX.Element | null {
  const [fallbackIcon, setFallbackIcon] = useState<string>('')
  const { logoUri, symbol } = props

  const onError = () => {
    if (!fallbackIcon) {
      setFallbackIcon(defaultIcon)
    }
  }

  return <IconImg src={fallbackIcon || logoUri || ''} alt={symbol} onError={onError} />
}

export default Icon
