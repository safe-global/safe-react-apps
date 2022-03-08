import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import useServices from './hooks/useServices';
import CreateTransactions from './pages/CreateTransactions';
import Dashboard from './pages/Dashboard';
import EditTransactionLibrary from './pages/EditTransactionLibrary';
import ReviewAndConfirm from './pages/ReviewAndConfirm';
import SaveTransactionLibrary from './pages/SaveTransactionLibrary';
import TransactionLibrary from './pages/TransactionLibrary';
import {
  DASHBOARD_PATH,
  EDIT_BATCH_PATH,
  REVIEW_AND_CONFIRM_PATH,
  SAVE_BATCH_PATH,
  TRANSACTION_LIBRARY_PATH,
} from './routes/routes';

const App = () => {
  const { web3, interfaceRepo, chainInfo } = useServices();

  const networkPrefix = chainInfo?.shortName;

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
          path={DASHBOARD_PATH}
          element={
            <Dashboard
              interfaceRepo={interfaceRepo}
              networkPrefix={networkPrefix}
              nativeCurrencySymbol={nativeCurrencySymbol}
              getAddressFromDomain={getAddressFromDomain}
            />
          }
        >
          {/* Transactions Batch section */}
          <Route
            index
            element={
              <CreateTransactions
                networkPrefix={networkPrefix}
                nativeCurrencySymbol={nativeCurrencySymbol}
                getAddressFromDomain={getAddressFromDomain}
              />
            }
          />

          {/* Save Batch section */}
          <Route
            path={SAVE_BATCH_PATH}
            element={
              <SaveTransactionLibrary
                networkPrefix={networkPrefix}
                nativeCurrencySymbol={nativeCurrencySymbol}
                getAddressFromDomain={getAddressFromDomain}
              />
            }
          />

          {/* Edit Batch section */}
          <Route
            path={EDIT_BATCH_PATH}
            element={
              <EditTransactionLibrary
                networkPrefix={networkPrefix}
                nativeCurrencySymbol={nativeCurrencySymbol}
                getAddressFromDomain={getAddressFromDomain}
              />
            }
          />
        </Route>

        {/* Review & Confirm Screen */}
        <Route
          path={REVIEW_AND_CONFIRM_PATH}
          element={
            <ReviewAndConfirm
              networkPrefix={networkPrefix}
              nativeCurrencySymbol={nativeCurrencySymbol}
              getAddressFromDomain={getAddressFromDomain}
            />
          }
        />

        {/* Transaction Library Screen */}
        <Route
          path={TRANSACTION_LIBRARY_PATH}
          element={
            <TransactionLibrary
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
