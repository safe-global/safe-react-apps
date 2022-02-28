import { useCallback } from 'react';
import { downloadBatch, importBatch, saveBatch } from './storageManager';

const useTransactionLibrary = () => {
  const handleSaveTransactionBatch = useCallback(async (name, transactions) => {
    await saveBatch(name, transactions);
  }, []);

  const handleDownloadTransactionBatch = useCallback(async (name, transactions) => {
    await downloadBatch(name, transactions);
  }, []);

  const handleImportTransactionBatch = useCallback(async (transactions) => {
    return await importBatch(transactions);
  }, []);

  return {
    handleSaveTransactionBatch,
    handleDownloadTransactionBatch,
    handleImportTransactionBatch,
  };
};

export default useTransactionLibrary;
