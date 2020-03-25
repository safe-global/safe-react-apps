import React from "react";

import Stepper from "./index";

export default {
  title: "Navigation/Stepper",
  component: Stepper,
  parameters: {
    componentSubtitle: "The Stepper component"
  }
};

const steps = [
  { id: "1", label: "Transaction submitted" },
  { id: "2", label: "Validating transaction" },
  { id: "3", label: "Deploying smart contract" },
  { id: "4", label: "Generating your Safe" },
  { id: "5", label: "Result" }
];

export const stepper = () => (
  <Stepper steps={steps} activeStepIndex={1} orientation="vertical" />
);

export const stepWithError = () => (
  <Stepper steps={steps} activeStepIndex={1} orientation="vertical" error />
);

export const orientationHorizontal = () => (
  <Stepper steps={steps} activeStepIndex={1} orientation="horizontal" />
);
