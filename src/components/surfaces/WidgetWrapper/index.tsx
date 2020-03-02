import React from "react";
import styled from "styled-components";

const Card = styled.div`
  font-family: "Averta";
  min-width: 150px;
  min-height: 300px;
  display: flex;
  justify-content: center;
`;

const Body = styled.div``;

const WidgetWrapper: React.FC = ({ children }) => (
  <Card>
    <Body>{children}</Body>
  </Card>
);

export default WidgetWrapper;
