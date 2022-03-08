import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@gnosis.pm/safe-react-components';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';

import TransactionsBatchList from '../components/TransactionsBatchList';
import CreateNewBatchCard from '../components/CreateNewBatchCard';
import { REVIEW_AND_CONFIRM_PATH } from '../routes/routes';
import QuickTip from '../components/QuickTip';
import { useTransactionLibrary, useTransactions } from '../store';

type CreateTransactionsProps = {
  networkPrefix: string | undefined;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const CreateTransactions = ({ networkPrefix, nativeCurrencySymbol, getAddressFromDomain }: CreateTransactionsProps) => {
  const { transactions, removeAllTransactions, replaceTransaction, reorderTransactions, removeTransaction } =
    useTransactions();
  const { importBatch, downloadBatch, saveBatch } = useTransactionLibrary();

  const [quickTipOpen, setQuickTipOpen] = useState(true);

  const navigate = useNavigate();

  return (
    <TransactionsSectionWrapper item xs={12} md={6}>
      {transactions.length > 0 ? (
        <>
          <TransactionsBatchList
            batchTitle={'Transactions Batch'}
            transactions={transactions}
            removeTransaction={removeTransaction}
            saveBatch={saveBatch}
            downloadBatch={downloadBatch}
            removeAllTransactions={removeAllTransactions}
            replaceTransaction={replaceTransaction}
            reorderTransactions={reorderTransactions}
            showTransactionDetails={false}
            showBatchHeader
            networkPrefix={networkPrefix}
            getAddressFromDomain={getAddressFromDomain}
            nativeCurrencySymbol={nativeCurrencySymbol}
          />
          {/* Go to Review Screen button */}
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            style={{ marginLeft: 35 }}
            variant="contained"
            color="primary"
            onClick={() => navigate(REVIEW_AND_CONFIRM_PATH)}
          >
            Create Batch
          </Button>
          {quickTipOpen && (
            <QuickTipWrapper>
              <QuickTip onClose={() => setQuickTipOpen(false)} />
            </QuickTipWrapper>
          )}
        </>
      ) : (
        <Hidden smDown>
          <CreateNewBatchCard onFileSelected={importBatch} />
        </Hidden>
      )}
    </TransactionsSectionWrapper>
  );
};

export default CreateTransactions;

const TransactionsSectionWrapper = styled(Grid)`
  position: sticky;
  top: 40px;
  align-self: flex-start;
`;

const QuickTipWrapper = styled.div`
  margin-left: 35px;
  margin-top: 20px;
`;
