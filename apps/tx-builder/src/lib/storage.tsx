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

const getBatches = async () => {
  const batches: Record<string, BatchFile> = {};
  try {
    await localforage.iterate((batch: BatchFile, key: string) => {
      batches[key] = batch;
    });
  } catch (error) {
    console.error(error);
  }
  return batches;
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
