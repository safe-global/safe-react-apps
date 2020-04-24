import React from "react";
import styled from "styled-components";

import hourGlass from "./hour-glass.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

function ComingSoon() {
  return (
    <Wrapper>
      <img alt="hour-glass" src={hourGlass} />
    </Wrapper>
  );
}

export default ComingSoon;
