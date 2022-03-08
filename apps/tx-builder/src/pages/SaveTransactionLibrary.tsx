import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import TransactionsBatchList from '../components/TransactionsBatchList';

import { useTransactionLibrary, useTransactions } from '../store';

const SaveTransactionLibrary = () => {
  const { transactions, removeAllTransactions, replaceTransaction, reorderTransactions, removeTransaction } =
    useTransactions();
  const { downloadBatch, saveBatch } = useTransactionLibrary();

  return (
    <TransactionsSectionWrapper item xs={12} md={6}>
      <TransactionsBatchList
        transactions={transactions}
        batchTitle={'TODO: SHOW BATCH NAME!! [Creation page]'}
        removeTransaction={removeTransaction}
        saveBatch={saveBatch}
        downloadBatch={downloadBatch}
        removeAllTransactions={removeAllTransactions}
        replaceTransaction={replaceTransaction}
        reorderTransactions={reorderTransactions}
        showTransactionDetails={false}
        showBatchHeader
      />
    </TransactionsSectionWrapper>
  );
};

export default SaveTransactionLibrary;

const TransactionsSectionWrapper = styled(Grid)`
  position: sticky;
  top: 40px;
  align-self: flex-start;
`;
