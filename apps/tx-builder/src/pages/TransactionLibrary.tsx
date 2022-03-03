import {
  AccordionSummary,
  Title,
  AccordionDetails,
  Accordion,
  Dot,
  Text,
  Tooltip,
  Icon,
  FixedIcon,
  Button,
  TextFieldInput,
} from '@gnosis.pm/safe-react-components';
import IconButton from '@material-ui/core/IconButton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DeleteBatchFromLibrary from '../components/modals/DeleteBatchFromLibrary';
import TransactionsBatchList from '../components/TransactionsBatchList';
import useModal from '../hooks/useModal/useModal';
import { REVIEW_AND_CONFIRM_PATH } from '../routes/routes';

import { useTransactionLibrary, useTransactions } from '../store';
import { Batch } from '../typings/models';

const TransactionLibrary = () => {
  const { batches, removeBatch, downloadBatch, renameBatch } = useTransactionLibrary();
  const { resetTransactions } = useTransactions();
  const navigate = useNavigate();
  const { open: showDeleteBatchModal, openModal: openDeleteBatchModal, closeModal: closeDeleteBatchModal } = useModal();
  const [batchToRemove, setBatchToRemove] = useState<Batch>();

  return (
    <Wrapper>
      <StyledTitle size="xl">Your transaction library</StyledTitle>

      {batches.length > 0 ? (
        batches.map((batch) => (
          <StyledAccordion key={batch.id} compact TransitionProps={{ unmountOnExit: true }}>
            <StyledAccordionSummary style={{ backgroundColor: 'white' }}>
              {/* transactions count  */}
              <TransactionCounterDot color="tag">
                <Text size="xl" color="white">
                  {batch.transactions.length}
                </Text>
              </TransactionCounterDot>

              {/* batch name  */}
              <BatchName batch={batch} renameBatch={renameBatch} />

              {/* batch actions  */}
              <BatchButtonsContainer>
                {/* execute batch */}
                <Tooltip placement="top" title="Execute batch" backgroundColor="primary" textColor="white" arrow>
                  <div>
                    <ExecuteBatchButton
                      size="md"
                      type="button"
                      aria-label="Execute batch"
                      variant="contained"
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        resetTransactions(batch.transactions);
                        navigate(REVIEW_AND_CONFIRM_PATH);
                      }}
                    >
                      <FixedIcon type={'arrowSentWhite'} />
                    </ExecuteBatchButton>
                  </div>
                </Tooltip>

                {/* download batch */}
                <Tooltip placement="top" title="Download" backgroundColor="primary" textColor="white" arrow>
                  <StyledIconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      downloadBatch(batch.name, batch.transactions);
                    }}
                  >
                    <Icon size="sm" type="importImg" color="primary" aria-label="Download" />
                  </StyledIconButton>
                </Tooltip>

                {/* delete batch */}
                <Tooltip placement="top" title="Delete Batch" backgroundColor="primary" textColor="white" arrow>
                  <StyledIconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setBatchToRemove(batch);
                      openDeleteBatchModal();
                    }}
                  >
                    <Icon size="sm" type="delete" color="error" aria-label="Delete Batch" />
                  </StyledIconButton>
                </Tooltip>
              </BatchButtonsContainer>
            </StyledAccordionSummary>
            <AccordionDetails>
              {/* transactions batch list  */}
              <TransactionsBatchList transactions={batch.transactions} showTransactionDetails showBatchHeader={false} />
            </AccordionDetails>
          </StyledAccordion>
        ))
      ) : (
        <div>TODO: No batches yet screen</div>
      )}
      {showDeleteBatchModal && batchToRemove && (
        <DeleteBatchFromLibrary
          batch={batchToRemove}
          onClick={(batch) => {
            closeDeleteBatchModal();
            removeBatch(batch.id);
            setBatchToRemove(undefined);
          }}
          onClose={() => {
            closeDeleteBatchModal();
            setBatchToRemove(undefined);
          }}
        />
      )}
    </Wrapper>
  );
};

export default TransactionLibrary;

const Wrapper = styled.main`
  && {
    padding: 48px;
    padding-top: 120px;
    max-width: 650px;
    margin: 0 auto;
  }
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 16px;
  font-size: 20px;
  line-height: normal;
`;

// background-color: white;
const StyledAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    margin-bottom: 0;
    border-radius: 8px;
    margin-bottom: 12px;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  height: 64px;

  & > .MuiAccordionSummary-content {
    display: flex;
    align-items: center;

    .MuiIconButton-root {
      padding: 8px;
    }
  }
`;

const TransactionCounterDot = styled(Dot)`
  height: 24px;
  width: 24px;

  background-color: #566976;
`;

const StyledTextFieldInput = styled(TextFieldInput)`
  && {
    margin-left: 8px;
    min-height: 0;

    .MuiOutlinedInput-input {
      padding: 8px;
    }
  }
`;

const StyledTransactionName = styled(Text)`
  margin-left: 8px;
  line-height: inherit;
  padding: 8px;
  border: 1px solid transparent;
  cursor: text;

  &:hover {
    border: 1px solid #e2e3e3;
    border-radius: 8px;
  }
`;

const BatchButtonsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ExecuteBatchButton = styled(Button)`
  &&.MuiButton-root {
    min-width: 0;
    width: 32px;
    height: 32px !important;
    padding: 0;
  }
`;

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    border-radius: 4px;
    margin-left: 8px;
    background-color: #f6f7f8;
  }
`;

type BatchNameType = {
  batch: Batch;
  renameBatch: (batchId: string | number, newName: string) => void;
};

function BatchName({ batch, renameBatch }: BatchNameType) {
  const [batchNameEditable, setBatchNameEditable] = useState(false);
  const [batchName, setBatchName] = useState(batch.name);

  useEffect(() => {
    setBatchName(batch.name);
  }, [batch.name]);

  const submitRenameBatch = () => {
    renameBatch(batch.id, batchName);
    setBatchNameEditable(false);
  };

  return batchNameEditable ? (
    <StyledTextFieldInput
      id={'batch-name-field'}
      name="batch-name"
      value={batchName}
      onChange={(event) => setBatchName(event.target.value)}
      onBlur={submitRenameBatch}
      onKeyPress={(event) => event.key === 'Enter' && submitRenameBatch()}
      onClick={(event) => event.stopPropagation()}
      label={''}
      autoFocus
    />
  ) : (
    <Tooltip placement="top" title="Edit batch name" backgroundColor="primary" textColor="white" arrow>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setBatchNameEditable(true);
        }}
      >
        <StyledTransactionName size="xl">{batchName}</StyledTransactionName>
      </div>
    </Tooltip>
  );
}
