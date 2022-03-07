import { Button, FixedIcon, Title } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import DeleteBatchModal from '../components/modals/DeleteBatchModal';
import TransactionsBatchList from '../components/TransactionsBatchList';
import useModal from '../hooks/useModal/useModal';
import { HOME_PATH } from '../routes/routes';
import { useEffect } from 'react';
import SuccessBatchCreationModal from '../components/modals/SuccessBatchCreationModal';
import { useTransactionLibrary, useTransactions } from '../store';

type ReviewAndConfirmProps = {
  networkPrefix: string | undefined;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const ReviewAndConfirm = ({ networkPrefix, getAddressFromDomain, nativeCurrencySymbol }: ReviewAndConfirmProps) => {
  const {
    open: showSuccessBatchModal,
    openModal: openSuccessBatchModal,
    closeModal: closeSuccessBatchModal,
  } = useModal();
  const {
    transactions,
    removeTransaction,
    removeAllTransactions,
    replaceTransaction,
    submitTransactions,
    reorderTransactions,
  } = useTransactions();
  const { downloadBatch, saveBatch } = useTransactionLibrary();

  const { open: showDeleteBatchModal, openModal: openDeleteBatchModal, closeModal: closeDeleteBatchModal } = useModal();

  const navigate = useNavigate();

  const createBatch = async () => {
    try {
      await submitTransactions();
      openSuccessBatchModal();
    } catch (e) {
      console.error('Error sending transactions:', e);
    }
  };

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
          removeTransaction={removeTransaction}
          saveBatch={saveBatch}
          downloadBatch={downloadBatch}
          reorderTransactions={reorderTransactions}
          replaceTransaction={replaceTransaction}
          showTransactionDetails
          showBatchHeader
          networkPrefix={networkPrefix}
          getAddressFromDomain={getAddressFromDomain}
          nativeCurrencySymbol={nativeCurrencySymbol}
        />

        <ButtonsWrapper>
          {/* Send batch button */}
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="contained"
            color="primary"
            onClick={createBatch}
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
            color="error"
            onClick={openDeleteBatchModal}
          >
            Cancel
          </StyledCancelButton>
        </ButtonsWrapper>
      </Wrapper>

      {/* Delete batch modal */}
      {showDeleteBatchModal && (
        <DeleteBatchModal count={transactions.length} onClick={removeAllTransactions} onClose={closeDeleteBatchModal} />
      )}

      {/* Success batch modal */}
      {showSuccessBatchModal && (
        <SuccessBatchCreationModal
          count={transactions.length}
          onClick={() => {
            removeAllTransactions();
            closeSuccessBatchModal();
          }}
          onClose={() => {
            removeAllTransactions();
            closeSuccessBatchModal();
          }}
        />
      )}
    </>
  );
};

export default ReviewAndConfirm;

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
