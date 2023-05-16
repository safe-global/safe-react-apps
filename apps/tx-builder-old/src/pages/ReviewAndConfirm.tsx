import { useEffect, useState } from 'react'
import {
  Button,
  ButtonLink,
  Card,
  FixedIcon,
  IconText,
  Link,
  Title,
  Loader,
  Text,
} from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import DeleteBatchModal from '../components/modals/DeleteBatchModal'
import TransactionsBatchList from '../components/TransactionsBatchList'
import useModal from '../hooks/useModal/useModal'
import { HOME_PATH } from '../routes/routes'
import SuccessBatchCreationModal from '../components/modals/SuccessBatchCreationModal'
import { useTransactionLibrary, useTransactions } from '../store'
import { useSimulation } from '../hooks/useSimulation'
import { FETCH_STATUS } from '../utils'

const ReviewAndConfirm = () => {
  const {
    open: showSuccessBatchModal,
    openModal: openSuccessBatchModal,
    closeModal: closeSuccessBatchModal,
  } = useModal()
  const {
    open: showDeleteBatchModal,
    openModal: openDeleteBatchModal,
    closeModal: closeDeleteBatchModal,
  } = useModal()
  const {
    transactions,
    removeTransaction,
    removeAllTransactions,
    replaceTransaction,
    submitTransactions,
    reorderTransactions,
  } = useTransactions()
  const { downloadBatch, saveBatch } = useTransactionLibrary()
  const [showSimulation, setShowSimulation] = useState<boolean>(false)
  const {
    simulation,
    simulateTransaction,
    simulationRequestStatus,
    simulationLink,
    simulationSupported,
  } = useSimulation()
  const navigate = useNavigate()

  const clickSimulate = () => {
    simulateTransaction()
    setShowSimulation(true)
  }

  const closeSimulation = () => setShowSimulation(false)

  const createBatch = async () => {
    try {
      await submitTransactions()
      openSuccessBatchModal()
    } catch (e) {
      console.error('Error sending transactions:', e)
    }
  }

  useEffect(() => {
    const hasTransactions = transactions.length > 0

    if (!hasTransactions) {
      navigate(HOME_PATH)
    }
  }, [transactions, navigate])

  return (
    <>
      <Wrapper>
        <StyledTitle size="xl">Review and Confirm</StyledTitle>

        <TransactionsBatchList
          batchTitle={'Transactions Batch'}
          transactions={transactions}
          removeTransaction={removeTransaction}
          saveBatch={saveBatch}
          downloadBatch={downloadBatch}
          reorderTransactions={reorderTransactions}
          replaceTransaction={replaceTransaction}
          showTransactionDetails
          showBatchHeader
        />

        <ButtonsWrapper>
          {/* Send batch button */}
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="contained"
            color="primary"
            onClick={createBatch}
          >
            <FixedIcon type={'arrowSentWhite'} />
            <StyledButtonLabel>Send Batch</StyledButtonLabel>
          </Button>

          {/* Cancel batch button */}
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="bordered"
            color="error"
            onClick={openDeleteBatchModal}
          >
            Cancel
          </Button>

          {/* Simulate batch button */}
          {simulationSupported && (
            <Button
              size="md"
              type="button"
              variant="contained"
              color="secondary"
              onClick={clickSimulate}
            >
              Simulate
            </Button>
          )}
        </ButtonsWrapper>

        {/* Simulation statuses */}
        {showSimulation && (
          <SimulationContainer>
            <StyledButton
              iconType="cross"
              iconSize="sm"
              color="inputFilled"
              onClick={closeSimulation}
            ></StyledButton>
            {simulationRequestStatus === FETCH_STATUS.ERROR && (
              <Text color="error" size="lg">
                An unexpected error occurred during simulation.
              </Text>
            )}

            {simulationRequestStatus === FETCH_STATUS.LOADING && (
              <>
                <Loader size="xs" />
                <Text color="inputFilled" size="lg">
                  Running simulation...
                </Text>
              </>
            )}

            {simulationRequestStatus === FETCH_STATUS.SUCCESS && (
              <>
                {!simulation.simulation.status && (
                  <>
                    <IconText
                      iconSize="md"
                      iconType="alert"
                      iconColor="error"
                      text="Failed"
                      textSize="lg"
                      color="error"
                    />
                    <Text color="inputFilled" size="lg">
                      The batch failed during the simulation throwing error{' '}
                      <b>{simulation.transaction.error_message}</b> in the contract at{' '}
                      <b>{simulation.transaction.error_info?.address}</b>. Full simulation report is
                      available{' '}
                      <Link href={simulationLink} target="_blank" rel="noreferrer" size="lg">
                        <b>on Tenderly</b>
                      </Link>
                      .
                    </Text>
                  </>
                )}
                {simulation.simulation.status && (
                  <>
                    <IconText
                      iconSize="md"
                      iconType="check"
                      iconColor="primary"
                      text="Success"
                      textSize="lg"
                      color="primary"
                    />
                    <Text color="inputFilled" size="lg">
                      The batch was successfully simulated. Full simulation report is available{' '}
                      <Link href={simulationLink} target="_blank" rel="noreferrer" size="lg">
                        <b>on Tenderly</b>
                      </Link>
                      .
                    </Text>
                  </>
                )}
              </>
            )}
          </SimulationContainer>
        )}
      </Wrapper>

      {/* Delete batch modal */}
      {showDeleteBatchModal && (
        <DeleteBatchModal
          count={transactions.length}
          onClick={removeAllTransactions}
          onClose={closeDeleteBatchModal}
        />
      )}

      {/* Success batch modal */}
      {showSuccessBatchModal && (
        <SuccessBatchCreationModal
          count={transactions.length}
          onClick={() => {
            removeAllTransactions()
            closeSuccessBatchModal()
          }}
          onClose={() => {
            removeAllTransactions()
            closeSuccessBatchModal()
          }}
        />
      )}
    </>
  )
}

export default ReviewAndConfirm

const StyledButton = styled(ButtonLink)`
  position: absolute;
  right: 26px;
  padding: 5px;
  width: 26px;
  height: 26px;

  :hover {
    background: ${({ theme }) => theme.colors.separator};
    border-radius: 16px;
  }
`

const SimulationContainer = styled(Card)`
  box-shadow: none;
  margin: 24px 0 0 34px;

  // last child is the status result
  & > :last-child {
    margin-top: 11px;
  }
`

const Wrapper = styled.main`
  && {
    padding: 120px 48px 48px;
    max-width: 650px;
    margin: 0 auto;
  }
`

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
  font-size: 20px;
  line-height: normal;
`

const ButtonsWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  padding: 0 0 0 34px;

  > button + button {
    margin-left: 16px;
  }

  > :last-child {
    margin-left: auto;
    margin-right: 0;
  }
`

const StyledButtonLabel = styled.span`
  margin-left: 8px;
`
