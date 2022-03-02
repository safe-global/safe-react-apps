import localforage from 'localforage';
import { BatchTransactionFile, BatchTransaction, ProposedTransaction } from '../../typings/models';
import { encodeToHexData } from '../../utils';
import { toChecksumAddress, toWei } from 'web3-utils';

localforage.config({
  name: 'tx-builder',
  version: 1.0,
  storeName: 'batch_transactions',
  description: 'List of stored transactions in the Transaction Builder',
});

const convertToProposedTransactions = (batchFile: BatchTransactionFile): ProposedTransaction[] => {
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

const convertToBatchFile = (name: string, txs: ProposedTransaction[]): BatchTransactionFile => {
  return {
    version: '1.0',
    chainId: '',
    createdAt: Date.now(),
    meta: {
      name,
      description: '',
      txBuilderVersion: '',
      checksum: '',
      createdFromSafeAddress: '',
      createdFromOwnerAddress: '',
    },
    transactions: txs.map(
      ({ description }: ProposedTransaction): BatchTransaction => ({
        to: description.to,
        value: description.value,
        data: description.hexEncodedData,
        contractMethod: description.contractMethod,
        contractInputsValues: description.contractFieldsValues,
      }),
    ),
  };
};

export const saveBatch = async (name: string, txs: ProposedTransaction[]): Promise<BatchTransactionFile> => {
  const batchFile = convertToBatchFile(name, txs);

  try {
    await localforage.setItem(uuidv4(), batchFile);
  } catch (error) {
    console.error(error);
  }

  return batchFile;
};

export const getBatches = async () => {
  try {
    const batches: any[] = [];
    await localforage.iterate((value: any, key: any, iterationNumber: any) => {
      batches.push({ id: key, ...value });
    });
    return batches;
  } catch (error) {
    console.error(error);
  }
};

export const downloadBatch = async (name: string, txs: ProposedTransaction[]) => {
  const batchFile = convertToBatchFile(name, txs);
  downloadObjectAsJson(name, batchFile);
};

export const importBatch = async (files: File[]): Promise<ProposedTransaction[]> => {
  return new Promise((resolve, reject) => {
    const file = files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const batchFile: BatchTransactionFile = JSON.parse(reader.result as string);
      resolve(convertToProposedTransactions(batchFile));
    };
  });
};

const downloadObjectAsJson = (name: string, batchFile: BatchTransactionFile) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(batchFile));
  const downloadAnchorNode = document.createElement('a');

  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', name + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
