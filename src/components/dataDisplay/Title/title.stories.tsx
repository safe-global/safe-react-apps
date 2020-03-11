import React from "react";

import Title from "./index";

export default {
  title: "Data Display/Title",
  component: Title,
  parameters: {
    componentSubtitle: "The Title component"
  }
};

export const title = () => <Title>Some Title</Title>;

