import React from "react";
import styled from "styled-components";

import { Icon } from "../../index";

const Circle = styled.div<{ disabled: boolean; error?: boolean }>`
  background-color: ${({ disabled, error, theme }) => {
    if (error) {
      return theme.colors.error;
    }
    if (disabled) {
      return theme.colors.disabled;
    }

    return theme.colors.primary;
  }};
  color: ${({ theme }) => theme.colors.white};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

type Props = {
  dotIndex: number;
  currentIndex: number;
  error?: boolean;
};
const DotStep = ({ currentIndex, dotIndex, error }: Props) => {
  return (
    <Circle disabled={dotIndex > currentIndex} error={error}>
      {dotIndex < currentIndex ? <Icon alt="check" size="xs" type="check" /> : dotIndex}
    </Circle>
  );
};

export default DotStep;
