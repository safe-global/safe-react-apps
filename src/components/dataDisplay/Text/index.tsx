import React from "react";
import styled from "styled-components";

type TextSize = "md" | "lg";

type Props = {
  strong?: boolean;
  size?: TextSize;
  centerText?: boolean;
  children: any;
};

const getFontSize = (size?: TextSize) => {
  switch (size) {
    case "lg":
      return "19px";
    default:
      return "14px";
  }
};

const StyledText = styled.p`
  margin: 10px 0;
  font-size: 14px;
  font-weight: ${({ strong }: Props) => (strong ? "bold" : "normal")};
  font-size: ${({ size }: Props) => getFontSize(size)};
  text-align: ${({ centerText }: Props) => (centerText ? "center" : "strat")};
`;

const Text = ({ children, ...rest }: Props) => (
  <StyledText {...rest}>{children}</StyledText>
);

export default Text;
