import React from "react";
import styled from "styled-components";

import { Size } from "../../types";

type Props = {
  children: any;
  size: Size;
  strong?: boolean;
  center?: boolean;
};

const StyledText = styled.p<Props>`
  margin: 10px 0;
  font-weight: ${({ strong }) => (strong ? "bold" : "normal")};  
  font-size: ${({ size, theme }) => theme.text.size[size].fontSize};  
  line-height: ${({ size, theme }) => theme.text.size[size].lineHeight};    
  text-align: ${({ center }) => (center ? "center" : "strat")};
`;

const Text = ({ children, ...rest }: Props) => (
  <StyledText {...rest}>{children}</StyledText>
);

export default Text;
