import { Title } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

import TransactionsBatchList from '../components/TransactionsBatchList';
import { ProposedTransaction } from '../typings/models';

type ReviewAndConfirmProps = {
  transactions: ProposedTransaction[];
  handleSubmitTransactions: () => void;
  handleRemoveTransaction: (index: number) => void;
  handleReorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
};

const ReviewAndConfirm = ({
  transactions,
  handleRemoveTransaction,
  handleSubmitTransactions,
  handleReorderTransactions,
}: ReviewAndConfirmProps) => {
  return (
    <Wrapper>
      <StyledTitle size="sm">Review and Confirm</StyledTitle>

      <TransactionsBatchList
        transactions={transactions}
        onRemoveTransaction={handleRemoveTransaction}
        onSubmitTransactions={handleSubmitTransactions}
        handleReorderTransactions={handleReorderTransactions}
        showTransactionDetails
        allowTransactionReordering
      />
    </Wrapper>
  );
};

export default ReviewAndConfirm;

const Wrapper = styled.div`
  max-width: 650px;
  margin: 32px auto 0 auto;
  padding: 0 24px;
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`;
