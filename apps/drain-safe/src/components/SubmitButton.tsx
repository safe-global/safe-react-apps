import { Button } from '@gnosis.pm/safe-react-components';
import Flex from './Flex';

function SubmitButton(): JSX.Element {
  return (
    <Flex centered>
      <Button size="lg" color="primary" variant="contained" type="submit">
        Transfer everything
      </Button>
    </Flex>
  );
}

export default SubmitButton;
