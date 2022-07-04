import React from 'react'
import { Text, Button, GenericModal, EthHashInfo } from '@gnosis.pm/safe-react-components'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { confirmable, ConfirmationProps } from '../utils/Confirmable'

type Props = {
  networkPrefix: string
  implementationAddress: string
  blockExplorerLink: string
} & ConfirmationProps

const ImplementationABIDialog: React.FC<Props> = ({
  networkPrefix,
  implementationAddress,
  blockExplorerLink,
  proceed,
}) => {
  return (
    <GenericModal
      title="Use the Implementation ABI?"
      withoutBodyPadding
      body={
        <StyledModalBodyWrapper>
          <Text size="xl">
            The contract looks like a proxy. Do you want to use the Implementation ABI?
          </Text>

          <SEthHashInfo
            shortName={networkPrefix || ''}
            hash={implementationAddress}
            explorerUrl={() => ({ url: blockExplorerLink, alt: blockExplorerLink })}
            showCopyBtn
            shouldShowShortName
            textSize="xl"
          />
          <StyledModalButtonsWrapper
            display="flex"
            alignItems="center"
            justifyContent="center"
            maxWidth="450px"
          >
            <Button size="md" variant="bordered" onClick={() => proceed(false)}>
              Keep Proxy ABI
            </Button>
            <Button
              size="md"
              style={{ marginLeft: 16 }}
              color="primary"
              onClick={() => proceed(true)}
            >
              Use Implementation ABI
            </Button>
          </StyledModalButtonsWrapper>
        </StyledModalBodyWrapper>
      }
      onClose={() => proceed(false)}
    />
  )
}

export default confirmable(ImplementationABIDialog)

const StyledModalBodyWrapper = styled.div`
  position: relative;
  padding: 24px;
  max-width: 450px;
`

const StyledModalButtonsWrapper = styled(Box)`
  margin-top: 24px;
`

const SEthHashInfo = styled(EthHashInfo)`
  margin-top: 24px;

  p {
    font-weight: bold;
  }
`
