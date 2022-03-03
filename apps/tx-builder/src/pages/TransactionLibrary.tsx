import {
  AccordionSummary,
  Title,
  AccordionDetails,
  Accordion,
  Dot,
  Text,
  Tooltip,
  Icon,
  FixedIcon,
  Button,
} from '@gnosis.pm/safe-react-components';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import TransactionsBatchList from '../components/TransactionsBatchList';

import { useTransactionLibrary } from '../store';

const TransactionLibrary = () => {
  const { batches } = useTransactionLibrary();

  return (
    <Wrapper>
      <StyledTitle size="xl">Your transaction library</StyledTitle>

      {batches.map(({ id, meta, transactions }: any) => (
        <StyledAccordion key={id} compact>
          <StyledAccordionSummary>
            {/* transactions count  */}
            <TransactionCounterDot color="tag">
              <Text size="xl" color="white">
                {transactions.length}
              </Text>
            </TransactionCounterDot>

            {/* batch name  */}
            <StyledTransactionName size="xl">{meta.name}</StyledTransactionName>

            {/* batch actions  */}
            <BatchButtonsContainer>
              {/* execute batch */}
              <Tooltip placement="top" title="Execute batch" backgroundColor="primary" textColor="white" arrow>
                <div>
                  <ExecuteBatchButton
                    size="md"
                    type="button"
                    aria-label="Execute batch"
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      console.log('TODO: Review Transactions');
                    }}
                  >
                    <FixedIcon type={'arrowSentWhite'} />
                  </ExecuteBatchButton>
                </div>
              </Tooltip>

              {/* download batch */}
              <Tooltip placement="top" title="Download" backgroundColor="primary" textColor="white" arrow>
                <StyledIconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    console.log('TODO: Download Batch');
                  }}
                >
                  <Icon size="sm" type="importImg" color="primary" aria-label="Download" />
                </StyledIconButton>
              </Tooltip>

              {/* delete batch */}
              <Tooltip placement="top" title="Delete Batch" backgroundColor="primary" textColor="white" arrow>
                <StyledIconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    console.log('TODO: Delete Batch');
                  }}
                >
                  <Icon size="sm" type="delete" color="error" aria-label="Delete Batch" />
                </StyledIconButton>
              </Tooltip>
            </BatchButtonsContainer>
          </StyledAccordionSummary>
          <AccordionDetails>
            {/* transactions batch list  */}
            <TransactionsBatchList
              transactions={transactions}
              showTransactionDetails
              allowTransactionReordering
              showBatchHeader={false}
            />
          </AccordionDetails>
        </StyledAccordion>
      ))}
    </Wrapper>
  );
};

export default TransactionLibrary;

const Wrapper = styled.main`
  && {
    padding: 48px;
    padding-top: 120px;
    max-width: 650px;
    margin: 0 auto;
  }
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 16px;
  font-size: 20px;
  line-height: normal;
`;

const StyledAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    margin-bottom: 0;
    border-radius: 8px;
    margin-bottom: 12px;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  height: 64px;

  & > .MuiAccordionSummary-content {
    display: flex;
    align-items: center;

    .MuiIconButton-root {
      padding: 8px;
    }
  }
`;

const TransactionCounterDot = styled(Dot)`
  height: 24px;
  width: 24px;

  background-color: #566976;
`;

const StyledTransactionName = styled(Text)`
  margin-left: 8px;
`;

const BatchButtonsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ExecuteBatchButton = styled(Button)`
  &&.MuiButton-root {
    min-width: 0;
    width: 32px;
    height: 32px !important;
    padding: 0;
  }
`;

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    border-radius: 4px;
    margin-left: 8px;
    background-color: #f6f7f8;
  }
`;
