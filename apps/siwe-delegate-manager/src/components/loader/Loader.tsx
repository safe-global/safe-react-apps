import { ReactNode } from 'react'
import { Loader as CircularProgress } from '@gnosis.pm/safe-react-components'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

type LoaderProps = {
  isLoading?: boolean
  children?: ReactNode
  loadingText?: ReactNode
  minHeight?: number
}

const Loader = ({ isLoading, loadingText, minHeight, children }: LoaderProps) => {
  return isLoading ? (
    <Box
      display={'flex'}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="div"
      minHeight={minHeight}
    >
      <StyledCircularProgress size="md" />
      <Typography>{loadingText}</Typography>
    </Box>
  ) : (
    <>{children}</>
  )
}

export default Loader

const StyledCircularProgress = styled(CircularProgress)`
  margin: 18px 0;
`
