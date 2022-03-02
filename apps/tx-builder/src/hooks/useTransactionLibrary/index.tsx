import { useCallback, useEffect, useState } from 'react';
import { downloadBatch, getBatches, importBatch, saveBatch } from './storageManager';

const useTransactionLibrary = () => {
  const [batches, setBatches] = useState<any>([]);

  useEffect(() => {
    const loadBatches = async () => {
      const batches = await getBatches();
      setBatches(batches || []);
    };

    loadBatches();
  }, []);

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
    batches,

    handleSaveTransactionBatch,
    handleDownloadTransactionBatch,
    handleImportTransactionBatch,
  };
};

export default useTransactionLibrary;
