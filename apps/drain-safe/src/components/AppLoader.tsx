import { Title, Loader } from '@gnosis.pm/safe-react-components'
import { Grid } from '@material-ui/core'

const AppLoader = (): React.ReactElement => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ height: 'calc(100% - 100px)' }}
    >
      <Title size="md">Waiting for Safe...</Title>
      <Loader size="md" />
    </Grid>
  )
}

export default AppLoader
