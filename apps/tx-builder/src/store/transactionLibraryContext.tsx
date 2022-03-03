import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTransactions } from './transactionsContext';
import StorageManager from '../lib/storage';
import { Batch, BatchFile, BatchTransaction, ProposedTransaction } from '../typings/models';
import { ChainInfo, SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import { encodeToHexData } from '../utils';
import { toChecksumAddress } from 'web3-utils';
import useServices from '../hooks/useServices';
import { addChecksum, validateChecksum } from '../lib/checksum';

const packageJson = require('../../package.json');

type TransactionLibraryContextProps = {
  batches: Batch[];
  saveBatch: (name: string, transactions: ProposedTransaction[]) => void;
  removeBatch: (batchId: string | number) => void;
  downloadBatch: (name: string, transactions: ProposedTransaction[]) => void;
  importBatch: (file: File | null) => void;
};

export const TransactionLibraryContext = createContext<TransactionLibraryContextProps | null>(null);

const TransactionLibraryProvider: React.FC = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const { resetTransactions } = useTransactions();
  const { chainInfo, safe } = useServices();

  const loadBatches = useCallback(async () => {
    if (chainInfo) {
      const batchesRecords = await StorageManager.getBatches();
      const batches: Batch[] = Object.keys(batchesRecords).reduce((batches: Batch[], key: string) => {
        const batchFile = batchesRecords[key];
        const batch = {
          id: key,
          name: batchFile.meta.name,
          transactions: convertToProposedTransactions(batchFile, chainInfo),
        };

        return [...batches, batch];
      }, []);

      setBatches(batches);
    }
  }, [chainInfo]);

  // on App init we load stored batches
  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const saveBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.saveBatch(addChecksum(generateBatchFile({ name, transactions, chainInfo, safe })));
      await loadBatches();
    },
    [chainInfo, safe, loadBatches],
  );

  const removeBatch = useCallback(
    async (batchId: string | number) => {
      await StorageManager.removeBatch(String(batchId));
      await loadBatches();
    },
    [loadBatches],
  );

  const downloadBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.downloadBatch(addChecksum(generateBatchFile({ name, transactions, chainInfo, safe })));
    },
    [chainInfo, safe],
  );

  const importBatch = useCallback(
    async (transactions) => {
      if (chainInfo) {
        const importedBatchFile = await StorageManager.importBatch(transactions);
        if (!validateChecksum(importedBatchFile)) {
          console.error('[Checksum check] - This file was modified since it was generated', importedBatchFile);
        }
        resetTransactions(convertToProposedTransactions(importedBatchFile, chainInfo));
      }
    },
    [resetTransactions, chainInfo],
  );

  return (
    <TransactionLibraryContext.Provider
      value={{
        batches,
        saveBatch,
        removeBatch,
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

const generateBatchFile = ({
  name,
  description,
  transactions,
  chainInfo,
  safe,
}: {
  name: string;
  description?: string;
  transactions: ProposedTransaction[];
  chainInfo: ChainInfo | undefined;
  safe: SafeInfo;
}): BatchFile => {
  return {
    version: '1.0',
    chainId: chainInfo?.chainId || '',
    createdAt: Date.now(),
    meta: {
      name,
      description,
      txBuilderVersion: packageJson.version,
      checksum: '',
      createdFromSafeAddress: safe.safeAddress,
      createdFromOwnerAddress: '',
    },
    transactions: convertToBatchTransactions(transactions),
  };
};

const convertToBatchTransactions = (transactions: ProposedTransaction[]): BatchTransaction[] => {
  return transactions.map(
    ({ description }: ProposedTransaction): BatchTransaction => ({
      to: description.to,
      value: description.value,
      data: description.hexEncodedData,
      contractMethod: description.contractMethod,
      contractInputsValues: description.contractFieldsValues,
    }),
  );
};

const convertToProposedTransactions = (batchFile: BatchFile, chainInfo: ChainInfo): ProposedTransaction[] => {
  return batchFile.transactions.map((transaction, index) => {
    if (transaction.data) {
      return {
        id: index,
        description: {
          to: transaction.to,
          value: transaction.value,
          hexEncodedData: transaction.data,
          nativeCurrencySymbol: chainInfo.nativeCurrency.symbol,
          networkPrefix: chainInfo.shortName,
        },
        raw: {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data || '',
        },
      };
    }

    return {
      id: index,
      description: {
        to: transaction.to,
        value: transaction.value,
        contractMethod: transaction.contractMethod,
        contractFieldsValues: transaction.contractInputsValues,
        nativeCurrencySymbol: chainInfo.nativeCurrency.symbol,
        networkPrefix: chainInfo.shortName,
      },
      raw: {
        to: toChecksumAddress(transaction.to),
        value: transaction.value,
        data: transaction.data || encodeToHexData(transaction.contractMethod, transaction.contractInputsValues) || '0x',
      },
    };
  });
};

export default TransactionLibraryProvider;
