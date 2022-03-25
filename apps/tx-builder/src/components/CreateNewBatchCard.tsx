import { ButtonLink, Icon, Text } from '@gnosis.pm/safe-react-components';
import Hidden from '@material-ui/core/Hidden';
import React, { useRef } from 'react';
import styled from 'styled-components';

import { ReactComponent as CreateNewBatchSVG } from '../assets/add-new-batch.svg';
import useDropZone from '../hooks/useDropZone';

type CreateNewBatchCardProps = {
  onFileSelected: (file: File | null) => void;
};

const CreateNewBatchCard = ({ onFileSelected }: CreateNewBatchCardProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isOverDropZone, handlers] = useDropZone((file: File | null) => {
    onFileSelected(file);
  });

  const handleFileSelected = (event: any) => {
    event.preventDefault();
    if (event.target.files.length) {
      onFileSelected(event.target.files[0]);
    }
  };

  const handleBrowse = function (event: any) {
    event.preventDefault();
    fileRef.current?.click();
  };

  return (
    <Wrapper>
      <Hidden smDown>
        <CreateNewBatchSVG />
      </Hidden>
      <StyledDragAndDropFileContainer {...handlers} dragOver={isOverDropZone}>
        <Icon type="termsOfUse" size="sm" />
        <StyledText size={'xl'}>Drag and drop a JSON file or</StyledText>
        <StyledButtonLink color="primary" onClick={handleBrowse}>
          choose a file
        </StyledButtonLink>
      </StyledDragAndDropFileContainer>
      <input ref={fileRef} id="logo-input" type="file" onChange={handleFileSelected} accept=".json" hidden />
    </Wrapper>
  );
};

export default CreateNewBatchCard;

const Wrapper = styled.div`
  margin-top: 64px;
`;

const StyledDragAndDropFileContainer = styled.div<{ dragOver: Boolean }>`
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

  ${({ dragOver }) => {
    if (dragOver) {
      return `
        transition: all 0.2s ease-in-out;
        transform: scale(1.05);
      `;
    }

    return `
      border-color: #008c73;
      background-color: #eaf7f4;
    `;
  }}
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
