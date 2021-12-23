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
      if (balance && balance > 0) {
        onCollect();
      }
    },
    [balance, onCollect],
  );

  return (
    <InfoContainer>
      <Title size="xs">Compound Token Balance</Title>
      <InfoRow
        label="Your COMP"
        data={
          <>
            {Number.isNaN(balance) ? 0 : balance?.toFixed(18)}{' '}
            <Link size="lg" onClick={handleOnCollect}>
              Collect
            </Link>
          </>
        }
      />
    </InfoContainer>
  );
}
