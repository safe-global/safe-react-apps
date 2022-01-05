import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  justify-content: left;
  padding: 24px;
`;

const WidgetWrapper: React.FC = ({ children }) => {
  return (
    <Card>
      <div>{children}</div>
    </Card>
  );
};

export default WidgetWrapper;
