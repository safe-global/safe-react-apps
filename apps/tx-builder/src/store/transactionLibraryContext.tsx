import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTransactions } from './transactionsContext';
import StorageManager from '../lib/storage';
import { BatchFile, BatchTransaction, ProposedTransaction } from '../typings/models';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { ChainInfo, SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import { encodeToHexData } from '../utils';
import { toChecksumAddress, toWei } from 'web3-utils';

const packageJson = require('../../package.json');

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
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const { sdk, safe } = useSafeAppsSDK();

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const info = await sdk.safe.getChainInfo();
        setChainInfo(info);
      } catch (e) {
        console.error('Unable to get chain info:', e);
      }
    };

    getChainInfo();
  }, [sdk]);

  const loadBatches = useCallback(async () => {
    const batches = await StorageManager.getBatches();
    setBatches(batches || []);
  }, []);

  // on App init we load stored batches
  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const saveBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.saveBatch(generateBatchFile({ name, transactions, chainInfo, safe }));
    },
    [chainInfo, safe],
  );

  const downloadBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.downloadBatch(generateBatchFile({ name, transactions, chainInfo, safe }));
    },
    [chainInfo, safe],
  );

  const importBatch = useCallback(
    async (transactions) => {
      resetTransactions(convertToProposedTransactions(await StorageManager.importBatch(transactions)));
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
  chainInfo: ChainInfo | null;
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

const convertToBatchTransactions = (txs: ProposedTransaction[]): BatchTransaction[] => {
  return txs.map(
    ({ description }: ProposedTransaction): BatchTransaction => ({
      to: description.to,
      value: description.value,
      data: description.hexEncodedData,
      contractMethod: description.contractMethod,
      contractInputsValues: description.contractFieldsValues,
    }),
  );
};

const convertToProposedTransactions = (batchFile: BatchFile): ProposedTransaction[] => {
  return batchFile.transactions.map((tx, index) => {
    if (tx.data) {
      return {
        id: index,
        description: {
          to: tx.to,
          value: tx.value,
          hexEncodedData: tx.data,
        },
        raw: {
          to: tx.to,
          value: tx.value || '',
          data: tx.data || '',
        },
      };
    }

    return {
      id: index,
      description: {
        to: tx.to,
        value: tx.value,
        contractMethod: tx.contractMethod,
        contractFieldsValues: tx.contractInputsValues,
      },
      raw: {
        to: toChecksumAddress(tx.to),
        value: toWei(tx.value || '0'),
        data: tx.data || encodeToHexData(tx.contractMethod, tx.contractInputsValues) || '0x',
      },
    };
  });
};

export default TransactionLibraryProvider;
