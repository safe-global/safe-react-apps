import { GenericModal } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import DelegateForm from 'src/components/delegate-form/DelegateForm'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'

type EditDelegatorModalProps = {
  delegator: string
  onClose: () => void
}

const EditDelegatorModal = ({ delegator, onClose }: EditDelegatorModalProps) => {
  const { setDelegate } = useDelegateRegistry()

  const handleSubmit = async (space: string, delegateAddress: string) => {
    await setDelegate(space, delegateAddress)
    onClose()
  }

  return (
    <GenericModal
      title="Edit Delegator"
      body={
        <FormContainer>
          <DelegateForm
            onSubmit={handleSubmit}
            delegator={delegator}
            buttonLabel={'Edit delegate'}
          />
        </FormContainer>
      }
      onClose={onClose}
    />
  )
}

export default EditDelegatorModal

const FormContainer = styled.div`
  max-width: 500px;
  border-radius: 8px;

  background-color: white;
`
