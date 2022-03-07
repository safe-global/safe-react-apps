import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import useServices from './hooks/useServices';

import useTransactions from './hooks/useTransactions';
import Dashboard from './pages/Dashboard';
import ReviewAndConfirm from './pages/ReviewAndConfirm';
import { HOME_PATH, REVIEW_AND_CONFIRM_PATH } from './routes/routes';

const App = () => {
  const {
    transactions,
    handleAddTransaction,
    handleRemoveTransaction,
    handleSubmitTransactions,
    handleRemoveAllTransactions,
    handleReorderTransactions,
    handleReplaceTransaction,
  } = useTransactions();

  const { web3, interfaceRepo, chainInfo } = useServices();

  const networkPrefix = chainInfo?.shortName;

  const navigate = useNavigate();
  const nativeCurrencySymbol = chainInfo?.nativeCurrency.symbol;

  const getAddressFromDomain = (name: string): Promise<string> => {
    return web3?.eth.ens.getAddress(name) || new Promise((resolve) => resolve(name));
  };

  return (
    <>
      {/* App Header */}
      <Header />

      <Routes>
        {/* Dashboard Screen (Create transactions) */}
        <Route
          path={HOME_PATH}
          element={
            <Dashboard
              transactions={transactions}
              handleAddTransaction={handleAddTransaction}
              handleRemoveTransaction={handleRemoveTransaction}
              handleSubmitTransactions={() => navigate(REVIEW_AND_CONFIRM_PATH)}
              handleRemoveAllTransactions={handleRemoveAllTransactions}
              handleReorderTransactions={handleReorderTransactions}
              handleReplaceTransaction={handleReplaceTransaction}
              interfaceRepo={interfaceRepo}
              networkPrefix={networkPrefix}
              nativeCurrencySymbol={nativeCurrencySymbol}
              getAddressFromDomain={getAddressFromDomain}
            />
          }
        />

        {/* Review & Confirm Screen */}
        <Route
          path={REVIEW_AND_CONFIRM_PATH}
          element={
            <ReviewAndConfirm
              transactions={transactions}
              handleRemoveTransaction={handleRemoveTransaction}
              handleRemoveAllTransactions={handleRemoveAllTransactions}
              handleSubmitTransactions={handleSubmitTransactions}
              handleReorderTransactions={handleReorderTransactions}
              handleReplaceTransaction={handleReplaceTransaction}
              networkPrefix={networkPrefix}
              nativeCurrencySymbol={nativeCurrencySymbol}
              getAddressFromDomain={getAddressFromDomain}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
