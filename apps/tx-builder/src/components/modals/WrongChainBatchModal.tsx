import { Button, GenericModal, Text } from '@gnosis.pm/safe-react-components';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

type WrongChainBatchModalProps = {
  onClick: () => void;
  onClose: () => void;
};

const WrongChainBatchModal = ({ onClick, onClose }: WrongChainBatchModalProps) => {
  return (
    <GenericModal
      title="Warning!"
      withoutBodyPadding
      body={
        <StyledModalBodyWrapper>
          <Text size={'xl'} center>
            This Batch is from another Chain!
          </Text>
          <StyleButtonContainer display="flex" alignItems="center" justifyContent="center" maxWidth={'450px'}>
            <Button size="md" type="button" onClick={onClick}>
              ok
            </Button>
          </StyleButtonContainer>
        </StyledModalBodyWrapper>
      }
      onClose={onClose}
    />
  );
};

export default WrongChainBatchModal;

const StyledModalBodyWrapper = styled.div`
  padding: 24px;
  max-width: 450px;
`;

const StyleButtonContainer = styled(Box)`
  margin-top: 24px;
`;
