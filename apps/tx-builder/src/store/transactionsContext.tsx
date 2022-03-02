import { createContext, useCallback, useContext, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { ProposedTransaction } from '../typings/models';

type TransactionContextProps = {
  transactions: ProposedTransaction[];
  resetTransactions: (transactions: ProposedTransaction[]) => void;
  handleAddTransaction: (newTransaction: ProposedTransaction) => void;
  handleRemoveTransaction: (index: number) => void;
  handleSubmitTransactions: () => void;
  handleRemoveAllTransactions: () => void;
  handleReorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
};

export const TransactionContext = createContext<TransactionContextProps | null>(null);

const TransactionsProvider: React.FC = ({ children }) => {
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const { sdk } = useSafeAppsSDK();

  const resetTransactions = useCallback((transactions: ProposedTransaction[]) => {
    setTransactions(transactions);
  }, []);

  const handleAddTransaction = useCallback(
    (newTransaction: ProposedTransaction) => {
      setTransactions([...transactions, newTransaction]);
    },
    [transactions],
  );

  const handleRemoveAllTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  const handleRemoveTransaction = useCallback(
    (index: number) => {
      const newTxs = transactions.slice();
      newTxs.splice(index, 1);
      setTransactions(newTxs);
    },
    [transactions],
  );

  const handleSubmitTransactions = useCallback(async () => {
    await sdk.txs.send({ txs: transactions.map((transaction) => transaction.raw) });
  }, [sdk.txs, transactions]);

  const handleReorderTransactions = useCallback((sourceIndex, destinationIndex) => {
    setTransactions((transactions) => {
      const transactionToMove = transactions[sourceIndex];
      transactions.splice(sourceIndex, 1); // we remove the transaction from the list
      transactions.splice(destinationIndex, 0, transactionToMove); // we add the transaction in the new position
      return transactions;
    });
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        resetTransactions,
        handleAddTransaction,
        handleRemoveTransaction,
        handleSubmitTransactions,
        handleRemoveAllTransactions,
        handleReorderTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const contextValue = useContext(TransactionContext);
  if (contextValue === null) {
    throw new Error('Component must be wrapped with <TransactionProvider>');
  }

  return contextValue;
};

export default TransactionsProvider;
