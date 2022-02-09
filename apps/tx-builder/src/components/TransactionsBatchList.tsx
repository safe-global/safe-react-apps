import { Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { ProposedTransaction } from '../typings/models';
import addNewBatch from '../assets/add-new-batch.svg';
import arrowToBlock from '../assets/arrow-to-block.svg';

type TransactionsBatchLsitProps = {
  transactions: ProposedTransaction[];
  // onAddTransaction: (transaction: ProposedTransaction) => void;
  onRemoveTransaction: (index: number) => void;
  onSubmitTransactions: () => void;
  // networkPrefix: undefined | string;
  // getAddressFromDomain: (name: string) => Promise<string>;
  // nativeCurrencySymbol: undefined | string;
};

function TransactionsBatchList({
  transactions,
  onRemoveTransaction,
  onSubmitTransactions,
}: TransactionsBatchLsitProps) {
  return (
    <Wrapper>
      {transactions.length === 0 ? (
        <AddNewBatchWrapper>
          {/* <ImageWrapper> */}
          <div>
            <img src={addNewBatch} alt="add new batch logo" />
            <StyledText size={'xl'} center>
              Start creating a new batch
            </StyledText>
            <ImageWrapper src={arrowToBlock} alt="arrow to batch logo" />
            {/* <StyledText size={'xl'} center>
              or
            </StyledText> */}
          </div>
          {/* </ImageWrapper> */}
        </AddNewBatchWrapper>
      ) : (
        <Typography>Transactions Batch ({transactions.length})</Typography>
      )}
    </Wrapper>
  );
}

export default TransactionsBatchList;

//   padding: 24px;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;

  width: 500px;
  margin-left: 24px;

  position: relative;
`;

const AddNewBatchWrapper = styled.div`
  margin-top: 100px;

  text-align: center;
`;

const ImageWrapper = styled.img`
  position: absolute;
  left: 0;
  top: 160px;
`;

const StyledText = styled(Text)`
  margin-top: 12px;
  color: #566976;
`;
