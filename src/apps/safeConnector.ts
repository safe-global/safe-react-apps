export interface SafeInfo {
  safeAddress: string;
  network: string;
  connectionId: string;
}

export interface TransactionUpdate {
  txHash: string;
  status: string;
}

export interface SafeListeners {
  onSafeInfo: (info: SafeInfo) => any;
  onTransactionUpdate?: (txId: TransactionUpdate) => any;
}

// const parentUrl = process.env.REACT_APP_PARENT_URL || "http://localhost:3000";
const parentUrl = "*"; //process.env.REACT_APP_PARENT_URL || "http://localhost:3000";
let listeners: SafeListeners;
let connectionId: string;

const operations = {
  SEND_TRANSACTIONS: "sendTransactions",
  GET_TRANSACTIONS: "getTransactions",
  ON_SAFE_INFO: "onSafeInfo",
  ON_TX_UPDATE: "onTransactionUpdate"
};

const onParentMessage = async ({ origin, data, ...rest }: MessageEvent) => {
  if (origin === window.origin) {
    return;
  }

  // if (origin !== parentUrl) {
  //   console.error(`Message from unknown origin: ${origin}`);
  //   return;
  // }

  if (!data || !data.messageId) {
    console.error("No message id provided");
    return;
  }

  switch (data.messageId) {
    case operations.ON_SAFE_INFO: {
      console.info("Safe:onSafeInfo");
      connectionId = data.data.connectionId;
      listeners.onSafeInfo({
        safeAddress: data.data.safeAddress,
        network: data.data.network,
        connectionId: data.data.connectionId
      });
      break;
    }
    case operations.ON_TX_UPDATE: {
      console.info("Safe:onTransactionUpdate");
      if (listeners.onTransactionUpdate) {
        listeners.onTransactionUpdate({
          txHash: data.data.txHash,
          status: data.data.status
        });
      }
      break;
    }
    default: {
      console.warn(`Safe:${data.messageId} unkown`);
      break;
    }
  }
};

const sendMessageToParent = (messageId: string, data: any) => {
  window.parent.postMessage({ connectionId, messageId, data }, parentUrl);
};

export function sendTransactions(txs: Array<any>) {
  sendMessageToParent(operations.SEND_TRANSACTIONS, txs);
}

export function addListeners({ ...allListeners }: SafeListeners) {
  listeners = { ...allListeners };
  window.addEventListener("message", onParentMessage);
}
