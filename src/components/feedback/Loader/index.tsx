import React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Size } from "../../types";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const sizeScales = {
  xs: 10,
  sm: 30,
  md: 50,
  lg: 70
};

type Props = {
  size: Size;
};

const Loader = ({ size }: Props) => (
  <Wrapper>
    <CircularProgress size={sizeScales[size]} />
  </Wrapper>
);

export default Loader;
