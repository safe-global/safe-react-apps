import { useState } from 'react'
import { Tooltip } from '@gnosis.pm/safe-react-components'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import styled from 'styled-components'

import useModal from 'src/hooks/useModal'
import DataTable from 'src/components/data-table/DataTable'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'
import AddressLabel from 'src/components/address-label/AddressLabel'
import EditDelegatorModal from '../modals/EditDelegatorModal'
import RemoveDelegatorModal from '../modals/RemoveDelegatorModal'

// TODO: CREATE A CONSTANT
const ALL_SPACES = ''
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const DelegationTable = () => {
  const { delegations } = useDelegateRegistry()

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

  const columns: string[] = ['space', 'delegate']

  const rows = delegations.map(({ space, delegate }) => ({
    id: space,
    // TODO: create SpaceLabel
    space: space === ALL_SPACES ? 'All Spaces' : space,
    delegate: (
      <DelegateRow
        delegate={delegate}
        space={space}
        openRemoveDelegatorModal={() => openRemoveDelegatorModal(space, delegate)}
        openEditDelegatorModal={() => openEditDelegatorModal(space, delegate)}
      />
    ),
  }))

  return (
    <>
      <Container>
        {/* Delegation Table */}
        <DataTable columns={columns} rows={rows} ariaLabel="delegations table" />
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

type DelegateRowProps = {
  delegate: string
  space: string
  openEditDelegatorModal: () => void
  openRemoveDelegatorModal: () => void
}

const DelegateRow = ({
  delegate,
  space,
  openEditDelegatorModal,
  openRemoveDelegatorModal,
}: DelegateRowProps) => {
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
        <IconButton aria-label="Edit delegator" size="small" onClick={openEditDelegatorModal}>
          <EditOutlinedIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>

      {/* Remove Delegator */}
      {delegate !== ZERO_ADDRESS && (
        <Tooltip title="Remove delegator" backgroundColor="primary" textColor="white" arrow>
          <IconButton aria-label="Remove delegator" size="small" onClick={openRemoveDelegatorModal}>
            <DeleteOutlineIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
