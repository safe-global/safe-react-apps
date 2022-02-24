import { Button, FixedIcon, Title } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import DeleteBatchModal from '../components/modals/DeleteBatchModal';
import TransactionsBatchList from '../components/TransactionsBatchList';
import useModal from '../hooks/useModal/useModal';
import { HOME_PATH } from '../routes/routes';
import { ProposedTransaction } from '../typings/models';
import { useEffect } from 'react';

type ReviewAndConfirmProps = {
  transactions: ProposedTransaction[];
  handleSubmitTransactions: () => void;
  handleRemoveTransaction: (index: number) => void;
  handleRemoveAllTransactions: () => void;
  handleReorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
};

const ReviewAndConfirm = ({
  transactions,
  handleRemoveTransaction,
  handleRemoveAllTransactions,
  handleSubmitTransactions,
  handleReorderTransactions,
}: ReviewAndConfirmProps) => {
  const { open: showDeleteBatchModal, openModal: openDeleteBatchModal, closeModal: closeDeleteBatchModal } = useModal();

  const navigate = useNavigate();

  useEffect(() => {
    const hasTransactions = transactions.length > 0;

    if (!hasTransactions) {
      navigate(HOME_PATH);
    }
  }, [transactions, navigate]);

  return (
    <>
      <Wrapper>
        <StyledTitle size="xl">Review and Confirm</StyledTitle>

        <TransactionsBatchList
          transactions={transactions}
          onRemoveTransaction={handleRemoveTransaction}
          handleReorderTransactions={handleReorderTransactions}
          showTransactionDetails
          allowTransactionReordering
        />

        <ButtonsWrapper>
          {/* Send batch button */}
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="contained"
            color="primary"
            onClick={handleSubmitTransactions}
          >
            <FixedIcon type={'arrowSentWhite'} />
            <StyledButtonLabel>Send Batch</StyledButtonLabel>
          </Button>

          {/* Cancel batch button */}
          <StyledCancelButton
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="bordered"
            color="primary"
            onClick={openDeleteBatchModal}
          >
            Cancel
          </StyledCancelButton>
        </ButtonsWrapper>
      </Wrapper>

      {/* Delete batch modal */}
      {showDeleteBatchModal && (
        <DeleteBatchModal
          count={transactions.length}
          onClick={handleRemoveAllTransactions}
          onClose={closeDeleteBatchModal}
        />
      )}
    </>
  );
};

export default ReviewAndConfirm;

const Wrapper = styled.div`
  max-width: 650px;
  margin: 32px auto 0 auto;
  padding: 0 24px 64px 0;
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
  font-size: 20px;
  line-height: normal;
`;

const ButtonsWrapper = styled.div`
  margin-top: 24px;
  padding: 0 34px;
`;

const StyledButtonLabel = styled.span`
  margin-left: 8px;
`;

const StyledCancelButton = styled(Button)`
  &&.MuiButton-root {
    margin-left: 16px;
    min-width: 0;
  }
`;
