import React from 'react';
import styled from 'styled-components';

interface Props {
  logoUri: string;
  symbol: string;
}

const IconImg = styled.img`
  margin-right: 10px;
  height: 1.5em;
  width: auto;
`;

function Icon(props: Props): JSX.Element {
  const { logoUri, symbol } = props;
  return <IconImg src={logoUri} alt={symbol} />;
}

export default Icon;
