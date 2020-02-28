import React from "react";
import styled from "styled-components";

const StyledTitle = styled.h6`
  font-family: "Averta";
  font-size: 16px;
  font-weight: 900;
  color: #001428;
  text-align: center;
  margin: 5px;
`;

type Props = {
  children: any;
};

const Title = ({ children }: Props) => <StyledTitle>{children}</StyledTitle>;

export default Title;
