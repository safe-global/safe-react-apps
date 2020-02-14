import React from "react";
import MaterialButton from "@material-ui/core/Button";
import styled from "styled-components";

const StyledButton = styled(MaterialButton)`
  && {
    background-color: #008c73;
    width: 106px;
    box-shadow: 1px 2px 10px #d4d4d396;
    border-radius: 4px;
    color: white;
    font-family: "Averta";
    
    ${styled(MaterialButton)}:hover & {
    background-color: #001428;
  }
  }
  
`;

const Button = ({ children, ...rest }: any) => (
  <StyledButton variant="contained" {...rest}>
    {children}
  </StyledButton>
);

export default Button;
