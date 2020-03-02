import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  font-family: 'Averta';
  min-width: 150px;
  min-height: 300px;
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #222222;
  margin: 0 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  img {
    width: 37px;
  }
`;

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  label:first-child {
    font-weight: bold;
  }
`;

const Body = styled.div``;

type Props = {
  icon: string;
  name: string;
  description: string;
};

const WidgetWrapper: React.FC<Props> = ({
  children,
  icon,
  name,
  description
}) => (
  <Card>
    {/* <Title>
       <img src={icon} alt={name}/> 
      <TitleText>
        <label>{name}</label>
        <label>{description}</label>
      </TitleText>
    </Title> */}
    <Body>{children}</Body>
  </Card>
);

export default WidgetWrapper;
