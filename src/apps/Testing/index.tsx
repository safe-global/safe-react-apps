import React from "react";
import styled from "styled-components";
import { Title, theme, Icon } from "@gnosis.pm/safe-react-components";
import { ThemeProvider } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

function Testing() {
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Icon size="md" type="eyeOff" color="error" />
        <Title size="sm">
          This app is for testing purposes
        </Title>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Testing;
