import React from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
`;

export default function BasicTextFields() {
  return (
    <StyledForm noValidate autoComplete="off">
      <TextField label="Amount" variant="filled" />
    </StyledForm>
  );
}
