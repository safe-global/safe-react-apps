import { useState } from 'react';
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
} from '@gnosis.pm/safe-react-components';
import IconButton from '@material-ui/core/IconButton';
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

              {/* editable batch name */}
              <Tooltip placement="top" title="Edit batch name" backgroundColor="primary" textColor="white" arrow>
                <div>
                  <Text size="xl">
                    <EditableLabel
                      contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={(event) => renameBatch(batch.id, event.target.innerText)}
                      onKeyPress={(event: any) =>
                        event.key === 'Enter' && renameBatch(batch.id, event.target.innerText) && event.preventDefault()
                      }
                      onClick={(event) => event.stopPropagation()} // to prevent open batch details
                    >
                      {batch.name}
                    </EditableLabel>
                  </Text>
                </div>
              </Tooltip>

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

const EditableLabel = styled.span`
  margin-left: 8px;
  padding: 10px;
  cursor: text;
  border-radius: 8px;
  border: 1px solid transparent;

  &:hover {
    border-color: #e2e3e3;
  }

  &:focus {
    outline-color: #008c73;
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
