import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'

import { useDelegateRegistry } from 'src/store/delegateRegistryContext'
import Header from 'src/components/header/Header'
import AddressLabel from 'src/components/address-label/AddressLabel'
import DelegateForm from 'src/components/delegate-form/DelegateForm'
import DelegationTable from 'src/components/delegation-table/DelegationTable'
import DelegationHistoryTable from 'src/components/delegation-history-table/DelegationHistoryTable'

function App() {
  const { delegateRegistryContract, setDelegate } = useDelegateRegistry()

  const handleAddNewDelegate = async (space: string, delegateAddress: string) => {
    await setDelegate(space, delegateAddress)
  }

  return (
    <>
      {/* App Header */}
      <Header />

      {/* Delegate Registry Title */}
      <AppWrapper>
        {delegateRegistryContract && (
          <TitleContainer>
            <Typography component="h2" variant="h5" gutterBottom>
              Delegate Registry Contract
            </Typography>
            <Typography component="h3" variant="h6" gutterBottom>
              <AddressLabel
                address={delegateRegistryContract.address}
                showCopyIntoClipboardButton
                showBlockExplorerLink
                ariaLabel="Delegate Registry contract"
              />
            </Typography>

            {/* TODO: add description */}
            <Typography>description</Typography>
          </TitleContainer>
        )}

        {/* Add New Delegate Form */}
        <AddDelegateContainer>
          <Typography component="h4" variant="h6" gutterBottom>
            Add new Delegate
          </Typography>
          {/* TODO: Add form description */}
          <Typography gutterBottom>Form description</Typography>

          <DelegateForm onSubmit={handleAddNewDelegate} />
        </AddDelegateContainer>

        {/* TODO: Add Pending Delate Transactions Table */}
        {/* <PendingDelegateTransactionsTable /> */}

        {/* Active Delegation Table */}
        <DelegationTable />

        {/* Delegation History Table */}
        <DelegationHistoryTable />
      </AppWrapper>
    </>
  )
}

export default App

const AppWrapper = styled.main`
  padding: 64px 8px;
  min-height: calc(100vh - 128px);

  background-color: #f6f6f6;

  text-align: center;
`

const TitleContainer = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
  padding: 24px 0;
`

const AddDelegateContainer = styled(Paper)`
  max-width: 500px;
  margin: 0 auto;
  margin-top: 24px;
  padding: 16px 0 0 0;
`
