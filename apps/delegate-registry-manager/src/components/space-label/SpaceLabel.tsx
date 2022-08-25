import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { green } from '@material-ui/core/colors'

type SpaceLabelProps = {
  space: string
}

export const ALL_SPACES = ''

const SpaceLabel = ({ space }: SpaceLabelProps) => {
  const isAllSpaces = space === ALL_SPACES
  return (
    <Box
      display={'flex'}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      component={'span'}
    >
      <StyledLabel>{isAllSpaces ? 'All spaces' : space}</StyledLabel>
    </Box>
  )
}

export default SpaceLabel

const StyledLabel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;

  background-color: ${green[600]};
  color: white;
  white-space: nowrap;
`
