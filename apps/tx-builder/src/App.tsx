import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { useTransactionLibrary } from './store';
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
  const { batches } = useTransactionLibrary();

  const navigate = useNavigate();

  return (
    <>
      {/* App Header */}
      <Header batches={batches} />

      <Routes>
        {/* Dashboard Screen (Create transactions) */}
        <Route
          path={HOME_PATH}
          element={<Dashboard handleSubmitTransactions={() => navigate(REVIEW_AND_CONFIRM_PATH)} />}
        />

        {/* Review & Confirm Screen */}
        <Route path={REVIEW_AND_CONFIRM_PATH} element={<ReviewAndConfirm />} />

        {/* Transaction Library Screen */}
        <Route path={TRANSACTION_LIBRARY_PATH} element={<TransactionLibrary batches={batches} />} />

        {/* Edit Transaction Library Screen */}
        <Route path={EDIT_TRANSACTION_LIBRARY_PATH} element={<EditTransactionLibrary />} />
      </Routes>
    </>
  );
};

export default App;
