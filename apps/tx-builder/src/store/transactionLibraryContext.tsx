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
  renameBatch: (batchId: string | number, newName: string) => void;
  downloadBatch: (name: string, transactions: ProposedTransaction[]) => void;
  executeBatch: (batch: Batch) => void;
  importBatch: (file: File | null) => void;
  hasChecksumWarning: boolean;
  setHasChecksumWarning: (hasChecksumWarning: boolean) => void;
};

export const TransactionLibraryContext = createContext<TransactionLibraryContextProps | null>(null);

const TransactionLibraryProvider: React.FC = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [hasChecksumWarning, setHasChecksumWarning] = useState<boolean>(false);
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

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;

    if (hasChecksumWarning) {
      id = setTimeout(() => setHasChecksumWarning(false), 5000);
    }

    return () => clearTimeout(id);
  }, [hasChecksumWarning]);

  const saveBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.saveBatch(
        addChecksum(generateBatchFile({ name, description: '', transactions, chainInfo, safe })),
      );
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

  const renameBatch = useCallback(
    async (batchId: string | number, newName: string) => {
      const batch = await StorageManager.getBatch(String(batchId));
      if (batch) {
        batch.meta.name = newName;
        await StorageManager.updateBatch(String(batchId), batch);
      }
      await loadBatches();
    },
    [loadBatches],
  );

  const downloadBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.downloadBatch(
        addChecksum(generateBatchFile({ name, description: '', transactions, chainInfo, safe })),
      );
    },
    [chainInfo, safe],
  );

  const initializeBatch = useCallback(
    (batchFile: BatchFile) => {
      if (chainInfo) {
        if (validateChecksum(batchFile)) {
          console.info('[Checksum check] - Checksum validation success', batchFile);
        } else {
          setHasChecksumWarning(true);
          console.error('[Checksum check] - This file was modified since it was generated', batchFile);
        }
        resetTransactions(convertToProposedTransactions(batchFile, chainInfo));
      }
    },
    [chainInfo, resetTransactions],
  );

  const executeBatch = useCallback(
    async (batch: Batch) => {
      const batchFile = await StorageManager.getBatch(batch.id as string);

      if (batchFile) {
        initializeBatch(batchFile);
      }
    },
    [initializeBatch],
  );

  const importBatch = useCallback(
    async (transactions) => {
      initializeBatch(await StorageManager.importBatch(transactions));
    },
    [initializeBatch],
  );

  return (
    <TransactionLibraryContext.Provider
      value={{
        batches,
        saveBatch,
        removeBatch,
        renameBatch,
        downloadBatch,
        executeBatch,
        importBatch,
        hasChecksumWarning,
        setHasChecksumWarning,
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
  description: string;
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
      data: description.customTransactionData,
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
        contractInterface: null,
        description: {
          to: transaction.to,
          value: transaction.value,
          customTransactionData: transaction.data,
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
      contractInterface: null,
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
