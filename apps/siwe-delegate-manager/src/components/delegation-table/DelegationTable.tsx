import { useState } from 'react'
import { Tooltip, Loader as CircularProgress } from '@gnosis.pm/safe-react-components'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import { green } from '@material-ui/core/colors'
import styled from 'styled-components'

import useModal from 'src/hooks/useModal'
import DataTable from 'src/components/data-table/DataTable'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'
import AddressLabel from 'src/components/address-label/AddressLabel'
import RemoveDelegatorModal from 'src/components/modals/RemoveDelegatorModal'
import SpaceLabel from '../space-label/SpaceLabel'

const DelegationTable = () => {
  const { delegations } = useDelegateRegistry()

  const [delegatorToUpdate, setDelegatorToUpdate] = useState<string>('')

  const {
    openModal: openRemoveModal,
    open: showRemoveModal,
    closeModal: closeRemoveModal,
  } = useModal()

  const openRemoveDelegatorModal = (space: string, delegate: string) => {
    openRemoveModal()
    setDelegatorToUpdate(delegate)
  }

  const columns: string[] = ['status', 'space', 'delegate']

  const rows = delegations.map(({ space, delegate }) => {
    const isSpaceLoading = space.isLoading

    return {
      id: space.id,
      status: <StatusCell isSpaceLoading={isSpaceLoading} />,
      space: <SpaceLabel space="SIWE Delegate" />,
      delegate: (
        <DelegateCell
          isSpaceLoading={isSpaceLoading}
          delegate={delegate}
          openRemoveDelegatorModal={() => openRemoveDelegatorModal(space.id, delegate)}
        />
      ),
    }
  })

  return (
    <>
      <Container>
        {/* Delegation Table */}
        <DataTable
          columns={columns}
          rows={rows}
          ariaLabel="delegations table"
          loadingText="Loading Delegations..."
        />
      </Container>

      {/* Remove Delegator modal */}
      {showRemoveModal && (
        <RemoveDelegatorModal delegator={delegatorToUpdate} onClose={closeRemoveModal} />
      )}
    </>
  )
}

export default DelegationTable

const Container = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
`

type DelegateCellProps = {
  delegate: string
  isSpaceLoading: boolean
  openRemoveDelegatorModal: () => void
}

const DelegateCell = ({
  delegate,
  isSpaceLoading,
  openRemoveDelegatorModal,
}: DelegateCellProps) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
      {/* Delegator Address label */}
      <AddressLabel
        address={delegate}
        showCopyIntoClipboardButton
        showBlockExplorerLink
        ariaLabel="delegate address"
      />

      {/* Remove Delegator */}
      <Tooltip title="Remove delegator" backgroundColor="primary" textColor="white" arrow>
        <span>
          <IconButton
            disabled={isSpaceLoading}
            aria-label="Remove delegator"
            size="small"
            onClick={openRemoveDelegatorModal}
          >
            <DeleteOutlineIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}

type StatusCellProps = {
  isSpaceLoading: boolean
}

const StatusCell = ({ isSpaceLoading }: StatusCellProps) => {
  return isSpaceLoading ? (
    <CircularProgress size="sm" />
  ) : (
    <CheckCircleRoundedIcon style={{ color: green[700] }} />
  )
}
