import { Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

import { ReactComponent as CreateNewBatchSVG } from '../assets/add-new-batch.svg';
import { ReactComponent as ArrowToFormSVG } from '../assets/arrow-to-block.svg';

const CreateNewBatchCard = () => {
  return (
    <Wrapper>
      <CreateNewBatchSVG />
      <StyledText size={'xl'} center>
        Start creating a new batch
      </StyledText>
      <StyledArrowToFormSVG />
    </Wrapper>
  );
};

export default CreateNewBatchCard;

const Wrapper = styled.div`
  position: relative;
  margin-top: 100px;
  padding-left: 150px;
  text-align: center;
`;

const StyledArrowToFormSVG = styled(ArrowToFormSVG)`
  position: absolute;
  top: 64px;
  left: 0;
`;

const StyledText = styled(Text)`
  margin-top: 12px;
  color: #566976;
`;
