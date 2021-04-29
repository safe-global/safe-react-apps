import React from 'react';
import styled from 'styled-components';
import { Asset } from './utils/gateway';

interface Props {
  asset: Asset;
}

const IconImg = styled.img`
  margin-right: 10px;
  height: 1.5em;
  width: auto;
`;

function Icon(props: Props): JSX.Element | null {
  const { token } = props.asset;
  const src = token ? token.logoUri : './eth.svg';
  const symbol = token ? token.symbol : 'ETH';
  return src ? <IconImg src={src} alt={symbol} /> : null;
}

export default Icon;
