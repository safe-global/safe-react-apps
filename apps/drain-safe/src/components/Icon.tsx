import React, { useState } from 'react';
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

function Icon(props: Props): JSX.Element | null {
  const [noIcon, setNoIcon] = useState<boolean>(false);
  const { logoUri, symbol } = props;

  return noIcon ? null : <IconImg src={logoUri} alt={symbol} onError={() => setNoIcon(true)} />;
}

export default Icon;
