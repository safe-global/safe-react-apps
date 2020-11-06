import React from "react";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  justify-content: left;
`;

const WidgetWrapper: React.FC = ({ children }) => (
  <Card>
    <div>{children}</div>
  </Card>
);

export default WidgetWrapper;
