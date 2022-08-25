import { useState } from 'react'
import { Tooltip, Loader as CircularProgress } from '@gnosis.pm/safe-react-components'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import { green } from '@material-ui/core/colors'
import styled from 'styled-components'

import useModal from 'src/hooks/useModal'
import DataTable from 'src/components/data-table/DataTable'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'
import AddressLabel from 'src/components/address-label/AddressLabel'
import EditDelegatorModal from 'src/components/modals/EditDelegatorModal'
import RemoveDelegatorModal from 'src/components/modals/RemoveDelegatorModal'

// TODO: CREATE A CONSTANT
const ALL_SPACES = ''
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const DelegationTable = () => {
  const { delegations, isContractLoading } = useDelegateRegistry()

  const [spaceToUpdate, setSpaceToUpdate] = useState<string>('')
  const [delegatorToUpdate, setDelegatorToUpdate] = useState<string>('')

  const { openModal: openEditModal, open: showEditModal, closeModal: closeEditModal } = useModal()
  const {
    openModal: openRemoveModal,
    open: showRemoveModal,
    closeModal: closeRemoveModal,
  } = useModal()

  const openRemoveDelegatorModal = (space: string, delegate: string) => {
    openRemoveModal()
    setSpaceToUpdate(space)
    setDelegatorToUpdate(delegate)
  }

  const openEditDelegatorModal = (space: string, delegate: string) => {
    openEditModal()
    setSpaceToUpdate(space)
    setDelegatorToUpdate(delegate)
  }

  const columns: string[] = ['status', 'space', 'delegate']

  const rows = delegations.map(({ space, delegate }) => {
    const isSpaceLoading = space.isLoading

    return {
      id: space.name,
      status: <StatusCell isSpaceLoading={isSpaceLoading} />,
      // TODO: create SpaceLabel
      space: space.name === ALL_SPACES ? 'All Spaces' : space.name,
      delegate: (
        <DelegateCell
          isSpaceLoading={isSpaceLoading}
          delegate={delegate}
          space={space.name}
          openRemoveDelegatorModal={() => openRemoveDelegatorModal(space.name, delegate)}
          openEditDelegatorModal={() => openEditDelegatorModal(space.name, delegate)}
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
          isTableLoading={isContractLoading}
          loadingText="Loading Delegations..."
        />
      </Container>

      {/* Edit Delegator modal */}
      {showEditModal && (
        <EditDelegatorModal
          space={spaceToUpdate}
          delegator={delegatorToUpdate}
          onClose={closeEditModal}
        />
      )}

      {/* Remove Delegator modal */}
      {showRemoveModal && (
        <RemoveDelegatorModal
          space={spaceToUpdate}
          delegator={delegatorToUpdate}
          onClose={closeRemoveModal}
        />
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
  space: string
  isSpaceLoading: boolean
  openEditDelegatorModal: () => void
  openRemoveDelegatorModal: () => void
}

const DelegateCell = ({
  delegate,
  space,
  isSpaceLoading,
  openEditDelegatorModal,
  openRemoveDelegatorModal,
}: DelegateCellProps) => {
  return (
    <Box display={'flex'} flexDirection="row" alignItems="center" justifyContent="center">
      {/* Delegator Address label */}
      {delegate === ZERO_ADDRESS ? (
        // TODO: REFINE THIS
        `No delegate defined ${space !== ALL_SPACES ? 'for this space' : ''}`
      ) : (
        <AddressLabel
          address={delegate}
          // showFullAddress
          showCopyIntoClipboardButton
          showBlockExplorerLink
          ariaLabel="delegate address"
        />
      )}

      {/* Edit Delegator */}
      <Tooltip title="Edit delegator" backgroundColor="primary" textColor="white" arrow>
        <span>
          <IconButton
            disabled={isSpaceLoading}
            aria-label="Edit delegator"
            size="small"
            onClick={openEditDelegatorModal}
          >
            <EditOutlinedIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Remove Delegator */}
      {delegate !== ZERO_ADDRESS && (
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
      )}
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
