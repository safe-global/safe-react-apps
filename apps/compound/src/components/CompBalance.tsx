import { SyntheticEvent, useCallback } from 'react';
import { Title, Link } from '@gnosis.pm/safe-react-components';
import { InfoContainer } from '../styles';
import InfoRow from './InfoRow';

type Props = {
  balance: number | undefined;
  onCollect: () => void;
};

export default function CompBalance({ balance, onCollect }: Props): React.ReactElement {
  const handleOnCollect = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      onCollect();
    },
    [onCollect],
  );

  return (
    <InfoContainer>
      <Title size="xs">Compound Token Balance</Title>
      <InfoRow
        label="Your COMP balance"
        data={
          <>
            {balance} <Link onClick={handleOnCollect}>Collect</Link>
          </>
        }
      />
    </InfoContainer>
  );
}
