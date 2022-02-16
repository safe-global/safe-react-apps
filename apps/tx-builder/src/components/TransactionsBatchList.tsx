import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dot,
  EthHashInfo,
  Text,
  Title,
  Icon,
  Tooltip,
  Button,
} from '@gnosis.pm/safe-react-components';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DragStart,
  DragUpdate,
  DropResult,
} from 'react-beautiful-dnd';

import { ProposedTransaction } from '../typings/models';

type TransactionsBatchListProps = {
  transactions: ProposedTransaction[];
  showTransactionDetails: boolean;
  allowTransactionReordering: boolean;
  onRemoveTransaction: (index: number) => void;
  handleRemoveAllTransactions: () => void;
  onSubmitTransactions: () => void;
  onEditTransaction: (index: number) => void;
  handleReorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
};

const TRANSACTION_LIST_DROPPABLE_ID = 'Transaction_List';
const DROP_EVENT = 'DROP';

function TransactionsBatchList({
  transactions,
  onRemoveTransaction,
  onSubmitTransactions,
  onEditTransaction,
  handleRemoveAllTransactions,
  handleReorderTransactions,
  showTransactionDetails,
  allowTransactionReordering,
}: TransactionsBatchListProps) {
  // we need those states to display the correct position in each tx during the drag & drop
  const [draggableTxIndexOrigin, setDraggableTxIndexOrigin] = useState<number>();
  const [draggableTxIndexDestination, setDraggableTxIndexDestination] = useState<number>();

  const onDragStart = ({ source }: DragStart) => {
    setDraggableTxIndexOrigin(source.index);
    setDraggableTxIndexDestination(source.index);
  };

  const onDragUpdate = ({ source, destination }: DragUpdate) => {
    setDraggableTxIndexOrigin(source.index);
    setDraggableTxIndexDestination(destination?.index);
  };

  // we only perform the reorder if its present
  const onDragEnd = ({ reason, source, destination }: DropResult) => {
    const sourceIndex = source.index;
    const destinationIndex = destination?.index;

    const isDropEvent = reason === DROP_EVENT; // because user can cancel the drag & drop
    const hasTxPositionChanged = sourceIndex !== destinationIndex && destinationIndex !== undefined;

    const shouldPerformTxReorder = isDropEvent && hasTxPositionChanged;

    if (shouldPerformTxReorder) {
      handleReorderTransactions(sourceIndex, destinationIndex);
    }

    setDraggableTxIndexOrigin(undefined);
    setDraggableTxIndexDestination(undefined);
  };

  return (
    <TransactionsBatchWrapper>
      {/* Transactions Batch Header */}
      <TransactionHeader>
        {/* Transactions Batch Counter */}
        <TransactionCounterDot color="tag">
          <Text size="xl" color="white">
            {transactions.length}
          </Text>
        </TransactionCounterDot>

        {/* Transactions Batch Title */}
        <TransactionsTitle withoutMargin size="lg">
          Transactions Batch
        </TransactionsTitle>

        {/* Transactions Batch Actions */}
        <Tooltip placement="top" title="Save to Library" backgroundColor="primary" textColor="white" arrow>
          <StyledHeaderIconButton>
            <Icon size="sm" type="importImg" color="primary" aria-label="Save to Library" />
          </StyledHeaderIconButton>
        </Tooltip>
        <Tooltip placement="top" title="Delete Batch" backgroundColor="primary" textColor="white" arrow>
          <StyledHeaderIconButton onClick={handleRemoveAllTransactions}>
            <Icon size="sm" type="delete" color="error" aria-label="Delete Batch" />
          </StyledHeaderIconButton>
        </Tooltip>
      </TransactionHeader>

      {/* Draggable Transaction List */}
      <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        <Droppable droppableId={TRANSACTION_LIST_DROPPABLE_ID}>
          {(provided: DroppableProvided) => (
            <TransactionList {...provided.droppableProps} ref={provided.innerRef}>
              {transactions.map(({ id, description }, index) => {
                console.log(transactions);
                const { to } = description;

                const transactionDescription = getTransactionText(description);

                const isLastTransaction = index === transactions.length - 1;

                return (
                  <Draggable
                    key={id}
                    index={index}
                    draggableId={id.toString()}
                    isDragDisabled={!allowTransactionReordering}
                  >
                    {function DraggableTransaction(provided, snapshot) {
                      const [isTxExpanded, setTxExpanded] = useState(false);

                      function onClickShowTransactionDetails() {
                        if (showTransactionDetails) {
                          setTxExpanded((isTxExpanded) => !isTxExpanded);
                        }
                      }
                      const isThisTxBeingDragging = snapshot.isDragging;

                      const showArrowAdornment = !isLastTransaction && !isThisTxBeingDragging;

                      // displayed orden can change if the user uses the drag and drop feature
                      const displayedTxPosition = getDisplayedTxPosition(
                        index,
                        isThisTxBeingDragging,
                        draggableTxIndexDestination,
                        draggableTxIndexOrigin,
                      );

                      return (
                        <TransactionListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* Transacion Position */}
                          <PositionWrapper>
                            <PositionDot color="tag">
                              <Text size="xl">{displayedTxPosition}</Text>
                            </PositionDot>
                            {showArrowAdornment && <ArrowAdornment />}
                          </PositionWrapper>

                          {/* Transacion Description */}
                          <StyledAccordion expanded={isTxExpanded} compact onChange={onClickShowTransactionDetails}>
                            <AccordionSummary
                              IconButtonProps={{
                                hidden: !showTransactionDetails,
                                style: {
                                  display: showTransactionDetails ? 'inline' : 'none',
                                  padding: 16,
                                },
                              }}
                              style={{ cursor: allowTransactionReordering ? 'grab' : 'pointer' }}
                            >
                              {/* Drag & Drop Indicator */}
                              {allowTransactionReordering && (
                                <Tooltip
                                  placement="top"
                                  title="Drag and Drop"
                                  backgroundColor="primary"
                                  textColor="white"
                                  arrow
                                >
                                  <DragAndDropIndicatorIcon fontSize="small" />
                                </Tooltip>
                              )}

                              {/* Destination Address label */}
                              <EthHashInfo shortName="rin" hash={to} shortenHash={4} shouldShowShortName />

                              {/* Transaction Description label */}
                              <TransactionsDescription size="lg">{transactionDescription}</TransactionsDescription>

                              {/* Transaction Actions */}
                              <Tooltip title="Edit transaction" backgroundColor="primary" textColor="white" arrow>
                                <TransactionActionButton
                                  size="medium"
                                  aria-label="Edit transaction"
                                  onClick={() => onEditTransaction(index)}
                                >
                                  <Icon size="sm" type="edit" />
                                </TransactionActionButton>
                              </Tooltip>
                              <Tooltip
                                placement="top"
                                title="Delete transaction"
                                backgroundColor="primary"
                                textColor="white"
                                arrow
                              >
                                <TransactionActionButton
                                  onClick={() => onRemoveTransaction(index)}
                                  size="medium"
                                  aria-label="Delete transaction"
                                >
                                  <Icon size="sm" type="delete" />
                                </TransactionActionButton>
                              </Tooltip>
                            </AccordionSummary>

                            {/* Transaction details will be implemented in other ticket */}
                            <AccordionDetails>
                              <Text size="xl">Hi! I am a very cool transaction! :D</Text>
                            </AccordionDetails>
                          </StyledAccordion>
                        </TransactionListItem>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TransactionList>
          )}
        </Droppable>
      </DragDropContext>

      {/* Create batch button */}
      <Button
        size="md"
        type="button"
        disabled={!transactions.length}
        style={{ marginLeft: 35 }}
        variant="contained"
        color="primary"
        onClick={onSubmitTransactions}
      >
        Create Batch
      </Button>
    </TransactionsBatchWrapper>
  );
}

export default TransactionsBatchList;

function getTransactionText(description: ProposedTransaction['description']) {
  const { contractMethod, hexEncodedData } = description;

  const isCustomHexDataTx = typeof contractMethod === 'undefined';
  const isContractInteractionTx = !!contractMethod;
  const isTokenTransferTx = !hexEncodedData && !isContractInteractionTx;

  if (isTokenTransferTx) {
    return 'Transfer';
  }

  if (isCustomHexDataTx) {
    return 'Custom hex data';
  }

  if (isContractInteractionTx) {
    return contractMethod.name;
  }

  // empty tx description as a fallback
  return '';
}

const UNKNOWN_POSITION_LABEL = '?';

// tx positions can change during drag & drop
function getDisplayedTxPosition(
  index: number,
  isDraggingThisTx: boolean,
  draggableTxIndexDestination?: number,
  draggableTxIndexOrigin?: number,
): string {
  // we show the correct position in the transaction that is being dragged
  if (isDraggingThisTx) {
    const isAwayFromDroppableZone = draggableTxIndexDestination === undefined;
    return isAwayFromDroppableZone ? UNKNOWN_POSITION_LABEL : String(draggableTxIndexDestination + 1);
  }

  // if a transaction is being dragged, we show the correct position in previous transactions
  if (index < Number(draggableTxIndexOrigin)) {
    // depending on the current destination we show the correct position
    return index >= Number(draggableTxIndexDestination) ? `${index + 2}` : `${index + 1}`;
  }

  // if a transaction is being dragged, we show the correct position in next transactions
  if (index > Number(draggableTxIndexOrigin)) {
    // depending on the current destination we show the correct position
    return index > Number(draggableTxIndexDestination) ? `${index + 1}` : `${index}`;
  }

  // otherwise we show the natural position
  return `${index + 1}`;
}

const TransactionsBatchWrapper = styled.section`
  margin-top: 24px;
`;

const TransactionHeader = styled.header`
  display: flex;
  align-items: center;
`;

const TransactionCounterDot = styled(Dot)`
  height: 24px;
  width: 24px;

  background-color: #566976;
`;

const TransactionsTitle = styled(Title)`
  flex-grow: 1;
  margin-left: 14px;

  font-size: 16px;
  line-height: normal;
  display: flex;
  align-items: center;
`;

const StyledHeaderIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    border-radius: 4px;
    background-color: white;
    margin-left: 8px;
  }
`;

const TransactionList = styled.ol`
  list-style: none;
  padding: 0;
`;

const TransactionListItem = styled.li`
  display: flex;

  width: 450px;
  margin-bottom: 8px;
`;

const StyledAccordion = styled(Accordion)`
  flex-grow: 1;

  &.MuiAccordion-root {
    margin-bottom: 0;
  }

  .MuiAccordionSummary-root {
    height: 52px;
    padding: 0px 8px;

    .MuiIconButton-root {
      padding: 8px;
    }
  }

  .MuiAccordionSummary-content {
    align-items: center;
  }
`;

const TransactionActionButton = styled(IconButton)`
  padding: 0;
`;

const PositionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 14px 10px 0 0;
`;

const PositionDot = styled(Dot)`
  height: 24px;
  width: 24px;

  background-color: #e2e3e3;
`;

const minArrowSize = '12';

const ArrowAdornment = styled.div`
  position: relative;
  border-left: 1px solid #e2e3e3;
  flex-grow: 1;
  margin-top: 8px;

  &&::before {
    content: ' ';
    display: inline-block;
    position: absolute;
    border-left: 1px solid #e2e3e3;

    height: ${minArrowSize}px;
    bottom: -${minArrowSize}px;
    left: -1px;
  }

  &&::after {
    content: ' ';
    display: inline-block;
    position: absolute;
    bottom: -${minArrowSize}px;
    left: -4px;

    border-width: 0 1px 1px 0;
    border-style: solid;
    border-color: #e2e3e3;
    padding: 3px;

    transform: rotate(45deg);
  }
`;

const TransactionsDescription = styled(Text)`
  flex-grow: 1;
  padding-left: 24px;
`;

const DragAndDropIndicatorIcon = styled(DragIndicatorIcon)`
  color: #b2bbc0;
  margin-right: 4px;
`;
