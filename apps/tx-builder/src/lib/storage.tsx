import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';
import localforage from 'localforage';
import { Batch, BatchFile } from '../typings/models';

localforage.config({
  name: 'tx-builder',
  version: 1.0,
  storeName: 'batch_transactions',
  description: 'List of stored transactions in the Transaction Builder',
});

const saveBatch = async (batchFile: BatchFile): Promise<BatchFile> => {
  try {
    await localforage.setItem(uuidv4(), batchFile);
  } catch (error) {
    console.error(error);
  }

  return batchFile;
};

const getBatches = async (chainInfo: ChainInfo) => {
  try {
    const batches: Batch[] = [];
    await localforage.iterate((batch: BatchFile, key: string) => {
      const parsedBatch = {
        ...batch,
        id: key,
        name: batch.meta.name,
        transactions: batch.transactions.map((transaction: any, index: number) => ({
          id: index,
          description: {
            to: transaction.to,
            value: transaction.value,
            hexEncodedData: transaction.data,
            contractMethod: transaction.contractMethod,
            contractFieldsValues: transaction.contractInputsValues,
            nativeCurrencySymbol: chainInfo.nativeCurrency.symbol,
            networkPrefix: chainInfo.shortName,
          },
          raw: {
            to: transaction.to,
            value: transaction.value,
            data: transaction.data,
          },
        })),
      };
      batches.push(parsedBatch);
    });
    return batches;
  } catch (error) {
    console.error(error);
  }
};

const downloadObjectAsJson = (batchFile: BatchFile) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(batchFile));
  const downloadAnchorNode = document.createElement('a');

  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', batchFile.meta.name + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const downloadBatch = async (batchFile: BatchFile) => {
  downloadObjectAsJson(batchFile);
};

const importBatch = async (file: File): Promise<BatchFile> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const batchFile: BatchFile = JSON.parse(reader.result as string);
      resolve(batchFile);
    };
  });
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const StorageManager = {
  saveBatch,
  getBatches,
  downloadBatch,
  importBatch,
};

export default StorageManager;
