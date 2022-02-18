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
  FixedIcon,
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
import useModal from '../hooks/useModal/useModal';
import DeleteTransactionModal from './modals/DeleteTransactionModal';
import DeleteBatchModal from './modals/DeleteBatchModal';

type TransactionsBatchListProps = {
  transactions: ProposedTransaction[];
  showTransactionDetails: boolean;
  allowTransactionReordering: boolean;
  onRemoveTransaction: (index: number) => void;
  handleRemoveAllTransactions?: () => void;
  onSubmitTransactions: () => void;
  handleReorderTransactions: (sourceIndex: number, destinationIndex: number) => void;
};

const TRANSACTION_LIST_DROPPABLE_ID = 'Transaction_List';
const DROP_EVENT = 'DROP';

function TransactionsBatchList({
  transactions,
  onRemoveTransaction,
  onSubmitTransactions,
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

  // 2 modals needed: delete batch modal and delete transaction modal
  const { open: showDeleteBatchModal, openModal: openDeleteBatchModal, closeModal: closeDeleteBatchModal } = useModal();
  const { open: showDeleteTxModal, openModal: openDeleteTxModal, closeModal: closeDeleteTxModal } = useModal();
  const [txToRemove, setTxToRemove] = useState<string>();

  return (
    <>
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

          {handleRemoveAllTransactions && (
            <Tooltip placement="top" title="Delete Batch" backgroundColor="primary" textColor="white" arrow>
              <StyledHeaderIconButton onClick={openDeleteBatchModal}>
                <Icon size="sm" type="delete" color="error" aria-label="Delete Batch" />
              </StyledHeaderIconButton>
            </Tooltip>
          )}
        </TransactionHeader>

        {/* Draggable Transaction List */}
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
          <Droppable droppableId={TRANSACTION_LIST_DROPPABLE_ID}>
            {(provided: DroppableProvided) => (
              <TransactionList {...provided.droppableProps} ref={provided.innerRef}>
                {transactions.map(({ id, description }, index) => {
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
                              <PositionDot color="tag" isDragging={isThisTxBeingDragging}>
                                <Text size="xl">{displayedTxPosition}</Text>
                              </PositionDot>
                              {showArrowAdornment && <ArrowAdornment />}
                            </PositionWrapper>

                            {/* Transacion Description */}
                            <StyledAccordion
                              expanded={isTxExpanded}
                              compact
                              onChange={onClickShowTransactionDetails}
                              isDragging={isThisTxBeingDragging}
                            >
                              <AccordionSummary
                                expandIcon={false}
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

                                {/* Delete transaction */}
                                <Tooltip
                                  placement="top"
                                  title="Delete transaction"
                                  backgroundColor="primary"
                                  textColor="white"
                                  arrow
                                >
                                  <TransactionActionButton
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setTxToRemove(String(index));
                                      openDeleteTxModal();
                                    }}
                                    size="medium"
                                    aria-label="Delete transaction"
                                  >
                                    <Icon size="sm" type="delete" />
                                  </TransactionActionButton>
                                </Tooltip>

                                {/* Expand transaction details */}
                                {showTransactionDetails && (
                                  <Tooltip
                                    placement="top"
                                    title="Expand transaction details"
                                    backgroundColor="primary"
                                    textColor="white"
                                    arrow
                                  >
                                    <TransactionActionButton
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onClickShowTransactionDetails();
                                      }}
                                      size="medium"
                                      aria-label="Expand transaction details"
                                    >
                                      <FixedIcon type={'chevronDown'} />
                                    </TransactionActionButton>
                                  </Tooltip>
                                )}
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

      {/* Delete batch modal */}
      {showDeleteBatchModal && handleRemoveAllTransactions && (
        <DeleteBatchModal
          count={transactions.length}
          onClick={() => {
            closeDeleteBatchModal();
            handleRemoveAllTransactions();
          }}
          onClose={closeDeleteBatchModal}
        />
      )}

      {/* Delete a transaction modal */}
      {showDeleteTxModal && (
        <DeleteTransactionModal
          txIndex={String(txToRemove)}
          txDescription={getTransactionText(transactions[Number(txToRemove)]?.description)}
          onClick={() => {
            closeDeleteTxModal();
            onRemoveTransaction(Number(txToRemove));
          }}
          onClose={closeDeleteTxModal}
        />
      )}
    </>
  );
}

export default TransactionsBatchList;

function getTransactionText(description: ProposedTransaction['description']) {
  const { contractMethod, hexEncodedData } = description;

  const isCustomHexDataTx = !!hexEncodedData;
  const isContractInteractionTx = !!contractMethod;
  const isTokenTransferTx = !isCustomHexDataTx && !isContractInteractionTx;

  if (isCustomHexDataTx) {
    return 'Custom hex data';
  }

  if (isContractInteractionTx) {
    return contractMethod.name;
  }

  if (isTokenTransferTx) {
    return 'Transfer';
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
  width: 100%;
`;

// batch header styles

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

// transactions list styles

const TransactionList = styled.ol`
  list-style: none;
  padding: 0;
`;

const TransactionListItem = styled.li`
  display: flex;
  margin-bottom: 8px;
`;

// transaction postion dot styles

const PositionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px 0 0;
`;

const PositionDot = styled(Dot).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => defaultValidatorFn(prop),
})<{ isDragging: boolean }>`
  height: 24px;
  width: 24px;
  background-color: ${({ isDragging }) => (isDragging ? '#92c9be' : ' #e2e3e3')};
  transition: background-color 0.5s linear;
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

// transaction description styles

const StyledAccordion = styled(Accordion).withConfig({
  shouldForwardProp: (prop) => !['isDragging'].includes(prop),
})<{ isDragging: boolean }>`
  flex-grow: 1;

  &.MuiAccordion-root {
    margin-bottom: 0;
    border-color: ${({ isDragging }) => (isDragging ? '#92c9be' : ' #e8e7e6')};
    transition: border-color 0.5s linear;
  }

  .MuiAccordionSummary-root {
    height: 52px;
    padding: 0px 8px;

    .MuiIconButton-root {
      padding: 8px;
    }
  }

  .MuiAccordionSummary-content {
    max-width: 100%;
    align-items: center;
  }
`;

const TransactionActionButton = styled(IconButton)`
  height: 32px;
  width: 32px;
  padding: 0;
`;

const TransactionsDescription = styled(Text)`
  flex-grow: 1;
  padding-left: 24px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DragAndDropIndicatorIcon = styled(DragIndicatorIcon)`
  color: #b2bbc0;
  margin-right: 4px;
`;
