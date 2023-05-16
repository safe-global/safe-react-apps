import { IconButton, Link, Paper, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import css from './styles.module.css'

// const OLD_TX_BUILDER_URL = 'https://gnosis-safe.io/app/tx-builder'
const OLD_TX_BUILDER_URL = 'http://localhost:3002/tx-builder-old'

const Banner = () => (
  <Paper className={css.wrapper}>
    <div className={css.header}>
      <Typography variant="h5">New Tx Builder domain</Typography>
      <IconButton size="small">
        <CloseIcon fontSize="medium" />
      </IconButton>
    </div>
    <Typography variant="body1" className={css.description}>
      Please migrate your transaction batches from the{' '}
      <Link href={OLD_TX_BUILDER_URL}>old Tx Builder app</Link> until 1 September.
    </Typography>
  </Paper>
)

export default Banner
