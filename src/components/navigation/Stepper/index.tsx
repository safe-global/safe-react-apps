import React from "react";
import StepperMUI from "@material-ui/core/Stepper";
import StepMUI from "@material-ui/core/Step";
import StepLabelMUI from "@material-ui/core/StepLabel";
import styled from "styled-components";

import DotStep from "./DotStep";

const StyledStepLabel = styled.p<any>`
  && {
    color: ${({ theme, error, index, activeStepIndex }) => {
      if (error) {
        return theme.colors.error;
      }

      if (index === activeStepIndex) {
        return theme.colors.primary;
      }

      if (index < activeStepIndex) {
        return theme.colors.disabled;
      }

      return theme.colors.secondary;
    }};
  }
`;

type Props = {
  steps: Array<{ id: string; label: string }>;
  activeStepIndex: number;
  error?: boolean;
  orientation: "vertical" | "horizontal";
};

const Stepper = ({ steps, error, activeStepIndex, orientation }: Props) => {
  return (
    <StepperMUI activeStep={activeStepIndex} orientation={orientation}>
      {steps.map((s, index) => {
        return (
          <StepMUI key={s.id}>
            <StepLabelMUI
              icon={
                <DotStep
                  currentIndex={activeStepIndex}
                  dotIndex={index}
                  error={index === activeStepIndex && error}
                />
              }
            >
              <StyledStepLabel
                error={index === activeStepIndex && error}
                index={index}
                activeStepIndex={activeStepIndex}
              >
                {s.label}
              </StyledStepLabel>
            </StepLabelMUI>
          </StepMUI>
        );
      })}
    </StepperMUI>
  );
};

export default Stepper;
