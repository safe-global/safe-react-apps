import { Button, IconButton, Link, Paper, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { exportBatches } from '../../lib/batches'
import { NEW_TX_BUILDER_URL, OLD_TX_BUILDER_URL, isOldDomain } from '../../utils'
import { localItem } from '../../lib/local-storage/local'
import { useState } from 'react'
import css from './styles.module.css'

const LS_KEY = 'rememberExportedBatches'

const NewDomainBody = () => (
  <Typography variant="body1" className={css.description}>
    Please migrate your transaction batches from the{' '}
    <Link href={OLD_TX_BUILDER_URL}>old Tx Builder app</Link> until 1 September.
  </Typography>
)

const OldDomainBody = () => (
  <>
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
  </>
)

const Banner = () => {
  const storedValue = localItem<boolean>(LS_KEY).get()
  const [showBanner, setShowBanner] = useState<boolean>(storedValue ?? true)

  const handleClose = () => {
    setShowBanner(false)
    localItem(LS_KEY).set(false)
  }

  return showBanner ? (
    <Paper className={css.wrapper}>
      <div className={css.header}>
        <Typography variant="h5">New Tx Builder domain</Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="medium" />
        </IconButton>
      </div>
      {isOldDomain ? <OldDomainBody /> : <NewDomainBody />}
    </Paper>
  ) : null
}

export default Banner
