import { ButtonLink, Icon, Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

import { ReactComponent as CreateNewBatchSVG } from '../assets/add-new-batch.svg';

const CreateNewBatchCard = () => {
  return (
    <Wrapper>
      <CreateNewBatchSVG />
      <StyledDragAndDropFileContainer>
        <Icon type="termsOfUse" size="sm" />
        <StyledText size={'xl'}>Drag and drop a JSON file or</StyledText>
        <StyledButtonLink color="primary" type="submit">
          choose a file
        </StyledButtonLink>
      </StyledDragAndDropFileContainer>
    </Wrapper>
  );
};

export default CreateNewBatchCard;

const Wrapper = styled.div`
  margin-top: 64px;
`;

const StyledDragAndDropFileContainer = styled.div`
  box-sizing: border-box;
  max-width: 420px;
  border: 2px dashed #008c73;
  border-radius: 8px;
  background-color: #eaf7f4;
  padding: 24px;
  margin: 24px auto 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled(Text)`
  margin-left: 4px;
  color: #566976;
`;

const StyledButtonLink = styled(ButtonLink)`
  padding: 0;
  text-decoration: none;

  && > p {
    font-size: 16px;
  }
`;
