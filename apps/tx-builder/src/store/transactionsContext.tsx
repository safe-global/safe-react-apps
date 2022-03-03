import { createContext, useCallback, useContext, useState } from 'react';
import { ProposedTransaction } from '../typings/models';
import useServices from '../hooks/useServices';

type TransactionContextProps = {
  transactions: ProposedTransaction[];
  resetTransactions: (transactions: ProposedTransaction[]) => void;
  addTransaction: (newTransaction: ProposedTransaction) => void;
  removeTransaction: (index: number) => void;
  submitTransactions: () => void;
  removeAllTransactions: () => void;
  reorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
};

export const TransactionContext = createContext<TransactionContextProps | null>(null);

const TransactionsProvider: React.FC = ({ children }) => {
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const { sdk } = useServices();

  const resetTransactions = useCallback((transactions: ProposedTransaction[]) => {
    setTransactions([...transactions]);
  }, []);

  const addTransaction = useCallback(
    (newTransaction: ProposedTransaction) => {
      setTransactions([...transactions, newTransaction]);
    },
    [transactions],
  );

  const removeAllTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  const removeTransaction = useCallback(
    (index: number) => {
      const newTxs = transactions.slice();
      newTxs.splice(index, 1);
      setTransactions(newTxs);
    },
    [transactions],
  );

  const submitTransactions = useCallback(async () => {
    await sdk.txs.send({ txs: transactions.map((transaction) => transaction.raw) });
  }, [sdk.txs, transactions]);

  const reorderTransactions = useCallback((sourceIndex, destinationIndex) => {
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
        addTransaction,
        removeTransaction,
        submitTransactions,
        removeAllTransactions,
        reorderTransactions,
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
