import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'
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
          <DescriptionContainer>
            <Typography align="justify" gutterBottom>
              The Sign-In with Ethereum Delegate Manager app allows owners of a Safe to delegate
              sign-in authority for applications that have integrated with{' '}
              <Link target="_blank" href="https://login.xyz/" rel="noreferrer">
                Sign-In with Ethereum for Safes
              </Link>{' '}
              to one or multiple other accounts. These accounts do not have to go through the
              multi-signature flow to sign-in.
            </Typography>

            <Typography align="justify">
              Safe has no influence on what actions projects allow, that are using the Delegation
              Registry Contract. Delegates do not have any control over on-chain assets stored in
              the Safe.
            </Typography>
          </DescriptionContainer>

          <Typography variant="h6">
            Delegation Registry Contract
            <AddressLabel
              address={delegateRegistryContract?.address || ''}
              showCopyIntoClipboardButton
              showBlockExplorerLink
              ariaLabel="Sign-In with Ethereum Delegate Registry contract"
            />
          </Typography>

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
