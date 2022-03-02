import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTransactions } from '.';
import StorageManager from '../lib/storage';
import { ProposedTransaction } from '../typings/models';

type TransactionLibraryContextProps = {
  batches: ProposedTransaction[];
  handleSaveTransactionBatch: (name: string, transactions: ProposedTransaction[]) => void;
  handleDownloadTransactionBatch: (name: string, transactions: ProposedTransaction[]) => void;
  handleImportTransactionBatch: (file: File | null) => void;
};

export const TransactionLibraryContext = createContext<TransactionLibraryContextProps | null>(null);

const TransactionLibraryProvider: React.FC = ({ children }) => {
  const [batches, setBatches] = useState<any>([]);
  const { resetTransactions } = useTransactions();

  useEffect(() => {
    const loadBatches = async () => {
      const batches = await StorageManager.getBatches();
      setBatches(batches || []);
    };

    loadBatches();
  }, []);

  const handleSaveTransactionBatch = useCallback(async (name, transactions) => {
    await StorageManager.saveBatch(name, transactions);
  }, []);

  const handleDownloadTransactionBatch = useCallback(async (name, transactions) => {
    await StorageManager.downloadBatch(name, transactions);
  }, []);

  const handleImportTransactionBatch = useCallback(
    async (transactions) => {
      resetTransactions(await StorageManager.importBatch(transactions));
    },
    [resetTransactions],
  );

  return (
    <TransactionLibraryContext.Provider
      value={{
        batches,
        handleSaveTransactionBatch,
        handleDownloadTransactionBatch,
        handleImportTransactionBatch,
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