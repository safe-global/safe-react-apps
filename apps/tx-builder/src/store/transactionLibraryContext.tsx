import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTransactions } from './transactionsContext';
import StorageManager from '../lib/storage';
import { ProposedTransaction } from '../typings/models';

type TransactionLibraryContextProps = {
  batches: ProposedTransaction[];
  saveBatch: (name: string, transactions: ProposedTransaction[]) => void;
  downloadBatch: (name: string, transactions: ProposedTransaction[]) => void;
  importBatch: (file: File | null) => void;
};

export const TransactionLibraryContext = createContext<TransactionLibraryContextProps | null>(null);

const TransactionLibraryProvider: React.FC = ({ children }) => {
  const [batches, setBatches] = useState<any>([]);
  const { resetTransactions } = useTransactions();

  const loadBatches = useCallback(async () => {
    const batches = await StorageManager.getBatches();
    setBatches(batches || []);
  }, []);

  // on App init we load stored batches
  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const saveBatch = useCallback(async (name, transactions) => {
    await StorageManager.saveBatch(name, transactions);
  }, []);

  const downloadBatch = useCallback(async (name, transactions) => {
    await StorageManager.downloadBatch(name, transactions);
  }, []);

  const importBatch = useCallback(
    async (transactions) => {
      resetTransactions(await StorageManager.importBatch(transactions));
    },
    [resetTransactions],
  );

  return (
    <TransactionLibraryContext.Provider
      value={{
        batches,
        saveBatch,
        downloadBatch,
        importBatch,
      }}
    >
      {children}
    </TransactionLibraryContext.Provider>
  );
};

export const useTransactionLibrary = () => {
  const contextValue = useContext(TransactionLibraryContext);
  if (contextValue === null) {
    throw new Error('Component must be wrapped with <TransactionLibraryProvider>');
  }

  return contextValue;
};

export default TransactionLibraryProvider;
