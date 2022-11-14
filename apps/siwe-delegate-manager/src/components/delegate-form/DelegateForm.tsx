import { useState, SyntheticEvent, useEffect } from 'react'
import { AddressInput, Button } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { isAddress } from 'ethers/lib/utils'

import { useSafeWallet } from 'src/store/safeWalletContext'
import { getSiWeSpaceId } from '../../utils/siwe'

type DelegateFormProps = {
  onSubmit: (address: string, space: string) => Promise<void>
  delegator?: string
  buttonLabel?: string
  disableFields?: boolean
}

const DelegateForm = ({ onSubmit, delegator, buttonLabel, disableFields }: DelegateFormProps) => {
  const [delegateAddress, setDelegateAddress] = useState<string>(delegator || '')
  const [formError, setFormError] = useState<string>('')

  const { getAddressFromDomain, chainInfo } = useSafeWallet()

  const networkPrefix = chainInfo?.shortName

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!delegateAddress) {
      setFormError('Delegate address required')
      return
    }

    try {
      const space = getSiWeSpaceId(delegateAddress)
      await onSubmit(space, delegateAddress)
    } catch (error: any) {
      setFormError(error.message)
      console.log('error: ', error)
    }
  }

  useEffect(() => {
    const isDelegateAddressValid =
      !delegateAddress || (delegateAddress && isAddress(delegateAddress))

    if (isDelegateAddressValid) {
      setFormError('')
    } else {
      setFormError('Address not valid')
    }
  }, [delegateAddress])

  return (
    <Form onSubmit={handleSubmit}>
      <FormFieldWrapper>
        <AddressInput
          id="delegateAddress"
          name="delegateAddress"
          label="Enter delegate address or ENS Name"
          hiddenLabel={false}
          address={delegateAddress}
          fullWidth
          showNetworkPrefix={!!networkPrefix}
          networkPrefix={networkPrefix}
          error={formError}
          showErrorsInTheLabel={false}
          getAddressFromDomain={getAddressFromDomain}
          onChangeAddress={address => setDelegateAddress(address)}
          disabled={disableFields}
        />
      </FormFieldWrapper>

      <ButtonContainer>
        <Button size="md" color="primary" type="submit">
          {buttonLabel || 'Add delegate'}
        </Button>
      </ButtonContainer>
    </Form>
  )
}

export default DelegateForm

const Form = styled.form`
  padding: 16px 0;
`

const FormFieldWrapper = styled.div`
  min-height: 64px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 12px;
`
