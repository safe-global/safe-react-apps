import { useMemo } from 'react'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'

import DataTable from 'src/components/data-table/DataTable'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'
import AddressLabel from 'src/components/address-label/AddressLabel'
import TransactionLabel from '../transaction-label/TransactionLabel'

// TODO: CREATE A CONSTANT
const ALL_SPACES = ''

const DelegationHistoryTable = () => {
  const { delegateEvents, isEventsLoading } = useDelegateRegistry()

  const columns: string[] = ['space', 'delegate', 'eventType', 'transaction']
  const rows = useMemo(
    () =>
      delegateEvents.map(({ EventId, space, delegate, transactionHash, eventType }) => ({
        id: EventId,
        space: space === ALL_SPACES ? 'All Spaces' : space,
        // TODO: Add Edit Delegate and clearDelegate Label component
        delegate: (
          <AddressLabel
            address={delegate}
            showCopyIntoClipboardButton
            showBlockExplorerLink
            ariaLabel="delegate address"
          />
        ),
        eventType,
        transaction: (
          <TransactionLabel
            address={transactionHash}
            showCopyIntoClipboardButton
            showBlockExplorerLink
            ariaLabel="delegate transaction"
          />
        ),
      })),
    [delegateEvents],
  )

  return (
    <Container>
      {/* TODO: Add loader component */}
      <DataTable
        columns={columns}
        rows={rows}
        ariaLabel="delegation history events table"
        isTableLoading={isEventsLoading}
        loadingText="Loading Delegation history..."
      />
    </Container>
  )
}

export default DelegationHistoryTable

const Container = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
`
