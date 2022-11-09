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

      {/* Delegate Registry Title & Form */}
      <AppWrapper>
        <TitleContainer>
          <Typography component="h2" variant="h5" gutterBottom>
            Sign-In With Ethereum Delegate Registry Contract
          </Typography>

          <Typography component="h3" variant="h6" gutterBottom>
            <AddressLabel
              address={delegateRegistryContract?.address || ''}
              showCopyIntoClipboardButton
              showBlockExplorerLink
              ariaLabel="Sign-In With Ethereum Delegate Registry contract"
            />
          </Typography>

          <DescriptionContainer>
            <Typography gutterBottom>
              The Sign-In With Ethereum Delegate allows owners of a Safe to delegate certain rights
              to another wallet e.g. gasless signing into a social application or gasless voting on
              behalf of a Safe.
            </Typography>

            <Typography>
              Safe has no influence on what actions other projects allow set delegates in the
              Delegation Registry Contract. Delegates do not have any control over on-chain assets
              in the Safe.
            </Typography>
          </DescriptionContainer>

          <AddDelegateFormContainer>
            <DelegateForm onSubmit={handleAddNewDelegate} />
          </AddDelegateFormContainer>
        </TitleContainer>

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
  padding: 24px 0 12px 0;
`

const DescriptionContainer = styled.div`
  padding: 12px 24px;
`

const AddDelegateFormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`
