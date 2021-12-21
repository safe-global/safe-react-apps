import { SyntheticEvent, useCallback } from 'react';
import { Title, Text, Link } from '@gnosis.pm/safe-react-components';
import { DaiInfo } from '../components';
import { Divider } from '@material-ui/core';

type Props = {
  balance: number;
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
    <DaiInfo>
      <Title size="xs">COMP Balance</Title>
      <div>
        <Text size="lg">Your balance</Text>
        <Text size="lg">
          {balance} COMP <Link onClick={handleOnCollect}>Collect</Link>
        </Text>
      </div>
    </DaiInfo>
  );
}
