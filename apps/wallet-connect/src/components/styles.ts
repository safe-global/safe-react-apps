import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'

export const StyledCardContainer = styled(Grid)`
  padding: 16px 22px;
`

export const StyledImage = styled.div<{ src: string }>`
  background: url('${({ src }) => src}') no-repeat center;
  height: 60px;
  width: 60px;
  background-size: contain;
`

export const StyledBoldText = styled(Text)`
  font-weight: bold;
`
