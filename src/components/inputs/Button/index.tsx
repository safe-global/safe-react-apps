import React from "react";
import ButtonMUI from "@material-ui/core/Button";
import styled from "styled-components";

import { Size, Color } from "../../types";
//import { getSize } from "../../utils";

const StyledButton = styled(ButtonMUI)<any>`
  && {
    background-color: #008c73;
    width: 106px;
    box-shadow: 1px 2px 10px #d4d4d396;
    border-radius: 4px;
    color: white;
    font-family: "Averta";
    text-transform: none;

    :hover {
      background-color: #001428;
    }
  }
`;

type Props = {
  children: any;
  size: Size;
  color: Color
};

const Button = ({ children, ...rest }: Props) => (
  <StyledButton {...rest}>
    {children}
  </StyledButton>
);

export default Button;
