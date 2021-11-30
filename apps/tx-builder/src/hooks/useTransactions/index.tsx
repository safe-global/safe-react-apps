import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { useCallback, useState } from 'react';
import { ProposedTransaction } from '../../typings/models';

export default function useTransactions() {
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const { sdk } = useSafeAppsSDK();

  const handleAddTransaction = useCallback(
    (tx: ProposedTransaction) => {
      setTransactions([...transactions, tx]);
    },
    [transactions],
  );

  const handleRemoveTransaction = useCallback(
    (index: number) => {
      const newTxs = transactions.slice();
      newTxs.splice(index, 1);
      setTransactions(newTxs);
    },
    [transactions],
  );

  const handleSubmitTransactions = useCallback(async () => {
    if (!transactions.length) {
      return;
    }

    try {
      await sdk.txs.send({ txs: transactions.map((transaction) => transaction.raw) }).catch(console.error);
      setTransactions([]);
    } catch (e) {
      console.error('Error sending transactions:', e);
    }
  }, [sdk.txs, transactions]);

  return {
    transactions,
    handleAddTransaction,
    handleRemoveTransaction,
    handleSubmitTransactions,
  };
}
