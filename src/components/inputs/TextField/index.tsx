import React from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
`;

type Props = {
  label: string;
  errorMsg?: string;
};

export default function BasicTextFields({ errorMsg, label, ...rest }: Props) {
  return (
    <StyledForm noValidate autoComplete="off">
      <TextField
        error={errorMsg && errorMsg.length ? true : false}
        label={errorMsg || label}
        variant="filled"
        {...rest}
      />
    </StyledForm>
  );
}
