import React from "react";
import styled from "styled-components";
import { Title, theme } from "@gnosis.pm/safe-react-components";
import { ThemeProvider } from "styled-components";

import hourGlass from "./hour-glass.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

function ComingSoon() {
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <img alt="hour-glass" src={hourGlass} />
        <Title size="sm">
          This app is currently under construction
        </Title>
      </Wrapper>
    </ThemeProvider>
  );
}

export default ComingSoon;
