import React from "react";

import Icon from "./index";

export default {
  title: "Data Display/Icon",
  component: Icon,
  parameters: {
    componentSubtitle: "The Icon component"
  }
};

export const icons = () => (
  <>
    <Icon alt="icon" size="xs" type="error" />
    <Icon alt="icon" size="xs" type="alert" />
    <Icon alt="icon" size="xs" type="info" />
    <Icon alt="icon" size="xs" type="check" />
  </>
);

export const customUrl = () => (
  <>
    <Icon
      alt="icon"
      size="xs"
      customUrl="https://compound.finance/images/compound-mark.svg"
    />
  </>
);

export const customSize = () => (
  <>
    <Icon alt="icon" size="xs" type="info" />
    <Icon alt="icon" size="sm" type="info" />
  </>
);
