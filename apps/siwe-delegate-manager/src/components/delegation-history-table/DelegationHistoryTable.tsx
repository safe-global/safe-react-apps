import { useMemo } from 'react'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'

import DataTable from 'src/components/data-table/DataTable'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'
import AddressLabel from 'src/components/address-label/AddressLabel'
import TransactionLabel from '../transaction-label/TransactionLabel'
import SpaceLabel from '../space-label/SpaceLabel'
import DelegateEventLabel from '../delegate-event-label/DelegateEventLabel'

const DelegationHistoryTable = () => {
  const { delegateEvents, isEventsLoading } = useDelegateRegistry()

  const columns: string[] = ['space', 'delegate', 'eventType', 'transaction']
  const rows = useMemo(
    () =>
      delegateEvents.map(({ EventId, space, delegate, transactionHash, eventType }) => ({
        id: EventId,
        space: <SpaceLabel space="SIWE Delegate" />,
        delegate: (
          <AddressLabel
            address={delegate}
            showCopyIntoClipboardButton
            showBlockExplorerLink
            ariaLabel="delegate address"
          />
        ),
        eventType: <DelegateEventLabel eventType={eventType} />,
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
