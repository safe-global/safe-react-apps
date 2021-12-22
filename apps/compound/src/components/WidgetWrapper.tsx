import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
};

export default function WidgetWrapper({ children }: Props): React.ReactElement {
  return (
    <Card>
      <div>{children}</div>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  justify-content: left;
  padding: 24px;
`;
