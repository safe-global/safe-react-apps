import { useEffect, useMemo } from 'react';
import { Button, FixedIcon, Icon, Title, Loader, Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import DeleteBatchModal from '../components/modals/DeleteBatchModal';
import TransactionsBatchList from '../components/TransactionsBatchList';
import useModal from '../hooks/useModal/useModal';
import { HOME_PATH } from '../routes/routes';
import SuccessBatchCreationModal from '../components/modals/SuccessBatchCreationModal';
import { useTransactionLibrary, useTransactions } from '../store';
import { useSimulation } from '../hooks/useSimulation';
import { FETCH_STATUS } from '../utils';

const ReviewAndConfirm = () => {
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
  const rawTransactions = useMemo(() => transactions.map((t) => t.raw), [transactions]);
  const { simulation, simulateTransaction, simulationRequestStatus, simulationLink } = useSimulation(rawTransactions);

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
          batchTitle={'Transactions Batch'}
          transactions={transactions}
          removeTransaction={removeTransaction}
          saveBatch={saveBatch}
          downloadBatch={downloadBatch}
          reorderTransactions={reorderTransactions}
          replaceTransaction={replaceTransaction}
          showTransactionDetails
          showBatchHeader
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
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="bordered"
            color="error"
            onClick={openDeleteBatchModal}
          >
            Cancel
          </Button>

          {/* Simulate batch button */}
          <Button size="md" type="button" variant="contained" color="secondary" onClick={simulateTransaction}>
            Simulate
          </Button>
        </ButtonsWrapper>

        {/* Simulation statuses */}
        <SimulationContainer>
          {simulationRequestStatus === FETCH_STATUS.LOADING && (
            <>
              <Loader size="xs" />
              <Text size="xl">The simulation is loading...</Text>
            </>
          )}

          {simulationRequestStatus === FETCH_STATUS.SUCCESS && (
            <>
              {!simulation.simulation.status && (
                <>
                  <Icon size="md" type="cross" color="error" />
                  <Text size="xl">
                    The batch failed during the simulation with an error <b>{simulation.transaction.error_message}</b>{' '}
                    in the contract at <b>{simulation.transaction.error_info?.address}</b>. Full simulation is available{' '}
                    <a href={simulationLink} target="_blank" rel="noreferrer">
                      on Tenderly.
                    </a>
                  </Text>
                </>
              )}
              {simulation.simulation.status && (
                <>
                  <Icon size="md" type="check" color="primary" />
                  <Text size="xl">
                    The batch was successfully simulated. Full simulation is available{' '}
                    <a href={simulationLink} target="_blank" rel="noreferrer">
                      on Tenderly.
                    </a>
                  </Text>
                </>
              )}
            </>
          )}
        </SimulationContainer>
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

const SimulationContainer = styled.div`
  margin-top: 24px;
  padding: 0 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  // first child is an icon
  & > :first-child {
    margin-right: 16px;
  }
`;

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
  display: flex;
  margin-top: 24px;
  padding: 0 0 0 34px;

  > button + button {
    margin-left: 16px;
  }

  > :last-child {
    margin-left: auto;
    margin-right: 0;
  }
`;

const StyledButtonLabel = styled.span`
  margin-left: 8px;
`;
