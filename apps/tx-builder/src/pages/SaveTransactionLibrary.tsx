import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { Button } from '@gnosis.pm/safe-react-components';

import TransactionsBatchList from '../components/TransactionsBatchList';
import { useTransactionLibrary, useTransactions } from '../store';
import { CREATE_BATCH_PATH, TRANSACTION_LIBRARY_PATH } from '../routes/routes';

const SaveTransactionLibrary = () => {
  const { transactions, removeAllTransactions, replaceTransaction, reorderTransactions, removeTransaction } =
    useTransactions();
  const { downloadBatch, saveBatch, updateBatch, batch } = useTransactionLibrary();

  const navigate = useNavigate();

  useEffect(() => {
    if (transactions.length === 0) {
      navigate(CREATE_BATCH_PATH);
    }
  }, [transactions, navigate]);

  return (
    <TransactionsSectionWrapper item xs={12} md={6}>
      <TransactionsBatchList
        transactions={transactions}
        batchTitle={batch?.name}
        removeTransaction={removeTransaction}
        saveBatch={saveBatch}
        downloadBatch={downloadBatch}
        removeAllTransactions={removeAllTransactions}
        replaceTransaction={replaceTransaction}
        reorderTransactions={reorderTransactions}
        showTransactionDetails={false}
        showBatchHeader
      />
      {/* Save Batch and redirect to Transaction library */}
      {batch && (
        <Button
          size="md"
          type="button"
          disabled={!transactions.length}
          style={{ marginLeft: 35 }}
          variant="contained"
          color="primary"
          onClick={() => {
            const { id, name } = batch;
            updateBatch(id, name, transactions);
            navigate(TRANSACTION_LIBRARY_PATH);
          }}
        >
          Save Batch
        </Button>
      )}
    </TransactionsSectionWrapper>
  );
};

export default SaveTransactionLibrary;

const TransactionsSectionWrapper = styled(Grid)`
  position: sticky;
  top: 40px;
  align-self: flex-start;
`;
