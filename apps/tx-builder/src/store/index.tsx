import TransactionsProvider from './transactionsContext';
import TransactionLibraryProvider from './transactionLibraryContext';
import React from 'react';

const StoreProvider: React.FC = ({ children }) => {
  return (
    <TransactionsProvider>
      <TransactionLibraryProvider>{children}</TransactionLibraryProvider>
    </TransactionsProvider>
  );
};

export { useTransactions } from './transactionsContext';
export { useTransactionLibrary } from './transactionLibraryContext';

export default StoreProvider;
