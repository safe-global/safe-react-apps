import { useCallback } from 'react';
import { downloadBatch, saveBatch } from './storageManager';

const useTransactionLibrary = () => {
  const handleSaveTransactionBatch = useCallback(async (name, transactions) => {
    await saveBatch(name, transactions);
  }, []);

  const handleDownloadTransactionBatch = useCallback(async (name, transactions) => {
    await downloadBatch(name, transactions);
  }, []);

  return {
    handleSaveTransactionBatch,
    handleDownloadTransactionBatch,
  };
};

export default useTransactionLibrary;
