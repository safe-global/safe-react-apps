import React from 'react';
import MaterialButton from '@material-ui/core/Button';
import styled from 'styled-components';

const StyledButton = styled(MaterialButton)`
  border-radius: 4px;
`;

const Button = ({ children, ...rest }: any) => (
  <StyledButton variant="contained" color="primary" {...rest}>
    {children}
  </StyledButton>
);

export default Button;
