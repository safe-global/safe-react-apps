import { IconButton, Paper } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import styled from 'styled-components'
import { Button, Icon, Link, Text, Title } from '@gnosis.pm/safe-react-components'
import { exportBatches } from '../../lib/batches'
import { NEW_TX_BUILDER_URL, OLD_TX_BUILDER_URL, isOldDomain } from '../../utils'
import { localItem } from '../../lib/local-storage/local'
import { useState } from 'react'
import css from './styles.module.css'

const LS_KEY = 'rememberExportedBatches'

const NewDomainBody = ({ onClose }: { onClose: () => void }) => (
  <>
    <Text size="xl" className={css.description}>
      Please make sure to migrate all transaction batches from the{' '}
      <Link href={OLD_TX_BUILDER_URL} size="xl">
        old Transaction Builder
      </Link>{' '}
      before <b>1st September</b>.
    </Text>
    <Button size="md" onClick={onClose}>
      Got it
    </Button>
  </>
)

const OldDomainBody = () => (
  <>
    <Text size="xl" className={css.description}>
      Please make sure to export all transaction batches before 1st September in order to import
      them in the{' '}
      <Link href={NEW_TX_BUILDER_URL} size="xl">
        new Transaction Builder
      </Link>
      .
    </Text>
    <Button size="md" onClick={exportBatches} style={{ width: '210px' }}>
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
    <Paper elevation={0} className={css.wrapper}>
      <div className={css.header}>
        <Icon size="md" type="info" color="primary" className={css.infoIcon} />
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <StyledTitle size="xs" strong withoutMargin>
        New Transaction Builder domain
      </StyledTitle>
      {isOldDomain ? <OldDomainBody /> : <NewDomainBody onClose={handleClose} />}
    </Paper>
  ) : null
}

export default Banner

const StyledTitle = styled(Title)`
  margin: 16px 0 8px;
`
