import localforage from 'localforage';
import { BatchTransactionFile, BatchTransaction, ProposedTransaction } from '../../typings/models';

localforage.config({
  name: 'tx-builder',
  version: 1.0,
  storeName: 'batch_transactions',
  description: 'List of stored transactions in the Transaction Builder',
});

const parseTransactions = (name: string, txs: ProposedTransaction[]): BatchTransactionFile => {
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
    transactions: txs.map(({ description }: ProposedTransaction) => ({
      to: description.to,
      value: description.value,
      data: description.hexEncodedData,
      contractMethod: description.contractMethod,
      contractInputsValues: description.contractFieldsValues,
    })),
  };
};

const createBatch = async (name: string, txs: ProposedTransaction[]): Promise<BatchTransactionFile> => {
  const batchFile = parseTransactions(name, txs);

  try {
    await localforage.setItem(uuidv4(), batchFile);
  } catch (error) {
    console.error(error);
  }

  return batchFile;
};

const downloadBatch = async (name: string, txs: ProposedTransaction[]) => {
  const batchFile = parseTransactions(name, txs);
  downloadObjectAsJson(name, batchFile);
};

const importBatch = async () => {};

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
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
