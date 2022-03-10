import styled from 'styled-components';

import { ReactComponent as CreateNewBatchSVG } from '../assets/add-new-batch.svg';

const CreateNewBatchCard = () => {
  return <StyledArrowToFormSVG />;
};

export default CreateNewBatchCard;

const StyledArrowToFormSVG = styled(CreateNewBatchSVG)`
  position: absolute;
  top: 64px;
  left: 40px;
`;
