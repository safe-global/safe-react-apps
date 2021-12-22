import { Divider, Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

type Props = {
  label: string;
  data: string | React.ReactElement | undefined;
};

export default function InfoRow({ label, data }: Props): React.ReactElement | null {
  return (
    <>
      <InfoRowContainer>
        <Text size="lg">{label}</Text>
        {data ? <Text size="lg">{data}</Text> : '-'}
      </InfoRowContainer>
      <Divider />
    </>
  );
}

const InfoRowContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
