import React from "react";
import styled from "styled-components";

const Card = styled.div`
  font-family: "Averta";
  width: 682px;
  min-height: 300px;
  display: flex;
  justify-content: left;
  padding-left: 24px;
`;

const Body = styled.div`
margin:0;

h5:first-child {
    margin-top: 24px;
  }
  
h5 {
  margin-top: 0px;
}
`;

const WidgetWrapper: React.FC = ({ children }) => (
  <Card>
    <Body>{children}</Body>
  </Card>
);

export default WidgetWrapper;
