import React from "react";
import ButtonMUI from "@material-ui/core/Button";
import styled from "styled-components";

const StyledButton = styled(ButtonMUI)`
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

const Button = ({ children, ...rest }: any) => (
  <StyledButton {...rest}>
    {children}
  </StyledButton>
);

export default Button;
