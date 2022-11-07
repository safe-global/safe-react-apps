import { useState, SyntheticEvent } from 'react'
import { AddressInput, Button, Switch, TextFieldInput } from '@gnosis.pm/safe-react-components'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { isAddress } from 'ethers/lib/utils'

import { useSafeWallet } from 'src/store/safeWalletContext'

type DelegateFormProps = {
  onSubmit: (address: string, space: string) => Promise<void>
  delegator?: string
  initialSpace?: string
  showSpace?: boolean
  buttonLabel?: string
  disableFields?: boolean
}

const DelegateForm = ({
  onSubmit,
  delegator,
  initialSpace,
  showSpace,
  buttonLabel,
  disableFields,
}: DelegateFormProps) => {
  const [delegateAddress, setDelegateAddress] = useState<string>(delegator || '')
  const [space, setSpace] = useState<string>(initialSpace || '')
  const [showSpaceInput, setShowSpaceInput] = useState<boolean>(showSpace || false)

  const { getAddressFromDomain, chainInfo } = useSafeWallet()

  const isDelegateAddressValid = !delegateAddress || (delegateAddress && isAddress(delegateAddress))
  const networkPrefix = chainInfo?.shortName

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()

    // TODO: add validations & errors
    try {
      const customSpace = showSpaceInput ? space : ''
      onSubmit(customSpace, delegateAddress)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormFieldWrapper>
        <AddressInput
          id="delegateAddress"
          name="delegateAddress"
          label="Enter delegate Address or ENS Name"
          hiddenLabel={false}
          address={delegateAddress}
          fullWidth
          showNetworkPrefix={!!networkPrefix}
          networkPrefix={networkPrefix}
          error={isDelegateAddressValid ? '' : 'The address is not valid'}
          showErrorsInTheLabel={false}
          getAddressFromDomain={getAddressFromDomain}
          onChangeAddress={address => setDelegateAddress(address)}
          disabled={disableFields}
        />
      </FormFieldWrapper>

      {/* Limit delegation to a specific space */}
      {!disableFields && (
        <Box display="flex" alignItems="center" paddingBottom="12px">
          <Switch checked={showSpaceInput} onChange={() => setShowSpaceInput(!showSpaceInput)} />
          <Typography>Limit delegation to a specific space</Typography>
        </Box>
      )}

      {showSpaceInput && (
        <FormFieldWrapper>
          <TextFieldInput
            id="space"
            name="space"
            label="Space"
            placeholder="e.g. balancer.eth"
            value={space}
            onChange={e => setSpace(e.target.value)}
            hiddenLabel={false}
            fullWidth
            disabled={disableFields}
          />
        </FormFieldWrapper>
      )}

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
  padding: 16px;
`

const FormFieldWrapper = styled.div`
  min-height: 64px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 12px;
`
