import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { orange, red } from '@material-ui/core/colors'

type DelegateEventLabelProps = {
  eventType: string
}

const DelegateEventLabel = ({ eventType }: DelegateEventLabelProps) => {
  return (
    <Box
      display={'flex'}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      component={'span'}
    >
      {eventType === 'SetDelegate' ? (
        <SetDelegateLabel>Set Delegate</SetDelegateLabel>
      ) : (
        <ClearDelegateLabel>Clear Delegate</ClearDelegateLabel>
      )}
    </Box>
  )
}

export default DelegateEventLabel

const SetDelegateLabel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;

  background-color: ${orange[800]};
  color: white;
  white-space: nowrap;
`

const ClearDelegateLabel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;

  background-color: ${red[800]};
  color: white;
  white-space: nowrap;
`
