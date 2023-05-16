import { Button, IconButton, Link, Paper, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { exportBatches } from '../../lib/batches/index'

import css from './styles.module.css'

// const NEW_TX_BUILDER_URL = 'https://apps-portal.safe.global/tx-builder'
const NEW_TX_BUILDER_URL = 'http://localhost:3001/tx-builder'

const Banner = () => (
  <Paper className={css.wrapper}>
    <div className={css.header}>
      <Typography variant="h5">New Tx Builder domain</Typography>
      <IconButton size="small">
        <CloseIcon fontSize="medium" />
      </IconButton>
    </div>
    <Typography variant="body1" className={css.description}>
      Please export your transaction batches until 1 September so you can import them in the new Tx
      Builder app domain.
    </Typography>
    <Typography variant="body1" className={css.description}>
      Back to the <Link href={NEW_TX_BUILDER_URL}>new domain</Link>
    </Typography>
    <Button variant="contained" color="primary" onClick={exportBatches} disableElevation fullWidth>
      Export batches
    </Button>
  </Paper>
)

export default Banner
