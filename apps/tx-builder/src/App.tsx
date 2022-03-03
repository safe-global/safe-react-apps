import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import useServices from './hooks/useServices';
import Dashboard from './pages/Dashboard';
import EditTransactionLibrary from './pages/EditTransactionLibrary';
import ReviewAndConfirm from './pages/ReviewAndConfirm';
import TransactionLibrary from './pages/TransactionLibrary';
import {
  EDIT_TRANSACTION_LIBRARY_PATH,
  HOME_PATH,
  REVIEW_AND_CONFIRM_PATH,
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
          path={HOME_PATH}
          element={
            <Dashboard
              interfaceRepo={interfaceRepo}
              networkPrefix={networkPrefix}
              nativeCurrencySymbol={nativeCurrencySymbol}
              getAddressFromDomain={getAddressFromDomain}
            />
          }
        />

        {/* Review & Confirm Screen */}
        <Route path={REVIEW_AND_CONFIRM_PATH} element={<ReviewAndConfirm />} />

        {/* Transaction Library Screen */}
        <Route path={TRANSACTION_LIBRARY_PATH} element={<TransactionLibrary />} />

        {/* Edit Transaction Library Screen */}
        <Route path={EDIT_TRANSACTION_LIBRARY_PATH} element={<EditTransactionLibrary />} />
      </Routes>
    </>
  );
};

export default App;
