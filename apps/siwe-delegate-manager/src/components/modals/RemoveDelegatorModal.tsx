import { GenericModal } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import DelegateForm from 'src/components/delegate-form/DelegateForm'
import { useDelegateRegistry } from 'src/store/delegateRegistryContext'

type RemoveDelegatorModalProps = {
  delegator: string
  onClose: () => void
}

const RemoveDelegatorModal = ({ delegator, onClose }: RemoveDelegatorModalProps) => {
  const { clearDelegate } = useDelegateRegistry()

  const handleSubmit = async (space: string) => {
    await clearDelegate(space)
    onClose()
  }

  return (
    <GenericModal
      title="Remove Delegator"
      body={
        <FormContainer>
          <DelegateForm
            onSubmit={handleSubmit}
            delegator={delegator}
            buttonLabel={'Remove delegate'}
            disableFields
          />
        </FormContainer>
      }
      onClose={onClose}
    />
  )
}

export default RemoveDelegatorModal

const FormContainer = styled.div`
  max-width: 500px;
  border-radius: 8px;

  background-color: white;
`
