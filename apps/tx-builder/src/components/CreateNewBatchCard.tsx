import { Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

import addNewBatch from '../assets/add-new-batch.svg';
import arrowToBlock from '../assets/arrow-to-block.svg';

function CreateNewBatchCard() {
  return (
    <Wrapper>
      <img src={addNewBatch} alt="add new batch placeholder" />
      <StyledText size={'xl'} center>
        Start creating a new batch
      </StyledText>
      <StyledImage src={arrowToBlock} alt="arrow to form decorator" />
    </Wrapper>
  );
}

export default CreateNewBatchCard;

const Wrapper = styled.div`
  position: relative;

  margin-top: 100px;
  margin-left: 32px;

  padding-left: 150px;

  text-align: center;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 64px;
  left: 0;
`;

const StyledText = styled(Text)`
  margin-top: 12px;
  color: #566976;
`;
