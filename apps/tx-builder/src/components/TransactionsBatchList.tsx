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
import TransactionDetails from './TransactionDetails';
import SaveBatchModal from './modals/SaveBatchModal';
import EditTransactionModal from './EditTransactionModal';
import { useNetwork } from '../store';

type TransactionsBatchListProps = {
  transactions: ProposedTransaction[];
  showTransactionDetails: boolean;
  showBatchHeader: boolean;
  batchTitle?: string;
  removeTransaction?: (index: number) => void;
  saveBatch?: (name: string, transactions: ProposedTransaction[]) => void;
  downloadBatch?: (name: string, transactions: ProposedTransaction[]) => void;
  removeAllTransactions?: () => void;
  replaceTransaction?: (newTransaction: ProposedTransaction, index: number) => void;
  reorderTransactions?: (sourceIndex: number, destinationIndex: number) => void;
};

const TRANSACTION_LIST_DROPPABLE_ID = 'Transaction_List';
const DROP_EVENT = 'DROP';

const TransactionsBatchList = ({
  transactions,
  reorderTransactions,
  removeTransaction,
  removeAllTransactions,
  replaceTransaction,
  saveBatch,
  downloadBatch,
  showTransactionDetails,
  showBatchHeader,
  batchTitle,
}: TransactionsBatchListProps) => {
  // we need those states to display the correct position in each tx during the drag & drop
  const [draggableTxIndexOrigin, setDraggableTxIndexOrigin] = useState<number>();
  const [draggableTxIndexDestination, setDraggableTxIndexDestination] = useState<number>();

  const { networkPrefix, getAddressFromDomain, nativeCurrencySymbol } = useNetwork();

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
      reorderTransactions?.(sourceIndex, destinationIndex);
    }

    setDraggableTxIndexOrigin(undefined);
    setDraggableTxIndexDestination(undefined);
  };

  // 4 modals needed: save batch modal, edit transaction modal, delete batch modal and delete transaction modal
  const { open: showDeleteBatchModal, openModal: openDeleteBatchModal, closeModal: closeDeleteBatchModal } = useModal();
  const { open: showSaveBatchModal, openModal: openSaveBatchModal, closeModal: closeSaveBatchModal } = useModal();
  const { open: showDeleteTxModal, openModal: openDeleteTxModal, closeModal: closeDeleteTxModal } = useModal();
  const { open: showEditTxModal, openModal: openEditTxModal, closeModal: closeEditTxModal } = useModal();

  const [txIndexToRemove, setTxIndexToRemove] = useState<string>();
  const [txIndexToEdit, setTxIndexToEdit] = useState<string>();

  return (
    <>
      <TransactionsBatchWrapper>
        {/* Transactions Batch Header */}
        {showBatchHeader && (
          <TransactionHeader>
            {/* Transactions Batch Counter */}
            <TransactionCounterDot color="tag">
              <Text size="xl" color="white">
                {transactions.length}
              </Text>
            </TransactionCounterDot>

            {/* Transactions Batch Title */}
            {batchTitle && (
              <TransactionsTitle withoutMargin size="lg">
                {batchTitle}
              </TransactionsTitle>
            )}

            {/* Transactions Batch Actions */}
            {saveBatch && (
              <Tooltip placement="top" title="Save to Library" backgroundColor="primary" textColor="white" arrow>
                <StyledHeaderIconButton onClick={openSaveBatchModal}>
                  <Icon size="sm" type="licenses" color="primary" aria-label="Save to Library" />
                </StyledHeaderIconButton>
              </Tooltip>
            )}
            {downloadBatch && (
              <Tooltip placement="top" title="Download" backgroundColor="primary" textColor="white" arrow>
                <StyledHeaderIconButton onClick={() => downloadBatch('test-download-batch', transactions)}>
                  <Icon size="sm" type="importImg" color="primary" aria-label="Download" />
                </StyledHeaderIconButton>
              </Tooltip>
            )}

            {removeAllTransactions && (
              <Tooltip placement="top" title="Delete Batch" backgroundColor="primary" textColor="white" arrow>
                <StyledHeaderIconButton onClick={openDeleteBatchModal}>
                  <Icon size="sm" type="delete" color="error" aria-label="Delete Batch" />
                </StyledHeaderIconButton>
              </Tooltip>
            )}
          </TransactionHeader>
        )}

        {/* Draggable Transaction List */}
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
          <Droppable droppableId={TRANSACTION_LIST_DROPPABLE_ID}>
            {(provided: DroppableProvided) => (
              <TransactionList {...provided.droppableProps} ref={provided.innerRef}>
                {transactions.map((transaction, index) => {
                  const { id, description } = transaction;
                  const { to } = description;

                  const transactionDescription = getTransactionText(description);

                  const isLastTransaction = index === transactions.length - 1;

                  return (
                    <Draggable key={id} index={index} draggableId={id.toString()} isDragDisabled={!reorderTransactions}>
                      {function DraggableTransaction(provided, snapshot) {
                        const [isTxExpanded, setTxExpanded] = useState(false);

                        const onClickShowTransactionDetails = () => {
                          if (showTransactionDetails) {
                            setTxExpanded((isTxExpanded) => !isTxExpanded);
                          }
                        };
                        const isThisTxBeingDragging = snapshot.isDragging;

                        const showArrowAdornment = !isLastTransaction && !isThisTxBeingDragging;

                        // displayed order can change if the user uses the drag and drop feature
                        const displayedTxPosition = getDisplayedTxPosition(
                          index,
                          isThisTxBeingDragging,
                          draggableTxIndexDestination,
                          draggableTxIndexOrigin,
                        );

                        return (
                          <TransactionListItem ref={provided.innerRef} {...provided.draggableProps}>
                            {/* Transacion Position */}
                            <PositionWrapper>
                              <PositionDot color="tag" isDragging={isThisTxBeingDragging}>
                                <Text size="xl">{displayedTxPosition}</Text>
                              </PositionDot>
                              {showArrowAdornment && <ArrowAdornment />}
                            </PositionWrapper>

                            {/* Transaction Description */}
                            <StyledAccordion
                              expanded={isTxExpanded}
                              compact
                              onChange={onClickShowTransactionDetails}
                              isDragging={isThisTxBeingDragging}
                              TransitionProps={{ unmountOnExit: true }}
                            >
                              <div {...provided.dragHandleProps}>
                                <AccordionSummary
                                  expandIcon={false}
                                  style={{ cursor: reorderTransactions ? 'grab' : 'pointer' }}
                                >
                                  {/* Drag & Drop Indicator */}
                                  {reorderTransactions && (
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
                                  <EthHashInfo
                                    shortName={networkPrefix || ''}
                                    hash={to}
                                    shortenHash={4}
                                    shouldShowShortName
                                  />

                                  {/* Transaction Description label */}
                                  <TransactionsDescription size="lg">{transactionDescription}</TransactionsDescription>

                                  {/* Transaction Actions */}

                                  {/* Edit transaction */}
                                  {replaceTransaction && (
                                    <Tooltip title="Edit transaction" backgroundColor="primary" textColor="white" arrow>
                                      <TransactionActionButton
                                        size="medium"
                                        aria-label="Edit transaction"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setTxIndexToEdit(String(index));
                                          openEditTxModal();
                                        }}
                                      >
                                        <Icon size="sm" type="edit" />
                                      </TransactionActionButton>
                                    </Tooltip>
                                  )}

                                  {/* Delete transaction */}
                                  {removeTransaction && (
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
                                          setTxIndexToRemove(String(index));
                                          openDeleteTxModal();
                                        }}
                                        size="medium"
                                        aria-label="Delete transaction"
                                      >
                                        <Icon size="sm" type="delete" />
                                      </TransactionActionButton>
                                    </Tooltip>
                                  )}

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
                              </div>

                              {/* Transaction details */}
                              <AccordionDetails>
                                <TransactionDetails transaction={transaction} />
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
      </TransactionsBatchWrapper>

      {/* Edit transaction modal */}
      {showEditTxModal && (
        <EditTransactionModal
          txIndex={Number(txIndexToEdit)}
          transaction={transactions[Number(txIndexToEdit)]}
          onSubmit={(updatedTransaction: ProposedTransaction) => {
            closeEditTxModal();
            replaceTransaction?.(updatedTransaction, Number(txIndexToEdit));
          }}
          onDeleteTx={() => {
            closeEditTxModal();
            removeTransaction?.(Number(txIndexToEdit));
          }}
          onClose={closeEditTxModal}
          networkPrefix={networkPrefix}
          getAddressFromDomain={getAddressFromDomain}
          nativeCurrencySymbol={nativeCurrencySymbol}
        />
      )}

      {/* Delete batch modal */}
      {showDeleteBatchModal && removeAllTransactions && (
        <DeleteBatchModal
          count={transactions.length}
          onClick={() => {
            closeDeleteBatchModal();
            removeAllTransactions();
          }}
          onClose={closeDeleteBatchModal}
        />
      )}

      {/* Delete a transaction modal */}
      {showDeleteTxModal && (
        <DeleteTransactionModal
          txIndex={Number(txIndexToRemove)}
          txDescription={getTransactionText(transactions[Number(txIndexToRemove)]?.description)}
          onClick={() => {
            closeDeleteTxModal();
            removeTransaction?.(Number(txIndexToRemove));
          }}
          onClose={closeDeleteTxModal}
        />
      )}

      {/* Save batch modal */}
      {showSaveBatchModal && (
        <SaveBatchModal
          onClick={(name: string) => {
            closeSaveBatchModal();
            saveBatch?.(name, transactions);
          }}
          onClose={closeSaveBatchModal}
        />
      )}
    </>
  );
};

export default TransactionsBatchList;

const getTransactionText = (description: ProposedTransaction['description']) => {
  const { contractMethod, customTransactionData } = description;

  const isCustomHexDataTx = !!customTransactionData;
  const isContractInteractionTx = !!contractMethod;
  const isTokenTransferTx = !isCustomHexDataTx && !isContractInteractionTx;

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
};

const UNKNOWN_POSITION_LABEL = '?';

// tx positions can change during drag & drop
const getDisplayedTxPosition = (
  index: number,
  isDraggingThisTx: boolean,
  draggableTxIndexDestination?: number,
  draggableTxIndexOrigin?: number,
): string => {
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
};

const TransactionsBatchWrapper = styled.section`
  width: 100%;
  user-select: none;
`;

// batch header styles

const TransactionHeader = styled.header`
  margin-top: 24px;
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
    border-color: ${({ isDragging }) => (isDragging ? '#92c9be' : '#e8e7e6')};
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
