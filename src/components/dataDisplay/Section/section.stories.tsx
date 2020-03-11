import React from "react";

import Section from "./index";

export default {
  title: "Data Display/Section",
  component: Section,
  parameters: {
    componentSubtitle: "Handy status label"
  }
};

export const section = () => <Section>some content</Section>;
