import React from "react";

import Loader from "./index";

export default {
  title: "Feedback/Loader",
  component: Loader,
  parameters: {
    componentSubtitle: "Loader component"
  }
};

export const loader = () => (
  <>
    <Loader size="xs" />
    <Loader size="sm" />
    <Loader size="md" />
    <Loader size="lg" />
  </>
);
