import { useEffect, useState } from 'react'
import { IconButton, Paper } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import styled from 'styled-components'
import { Button, Icon, Link, Text, Title } from '@gnosis.pm/safe-react-components'
import { exportBatches } from '../../lib/batches'
import { OLD_TX_BUILDER_URL, NEW_TX_BUILDER_URL, isOldDomain } from '../../utils'
import { localItem } from '../../lib/local-storage/local'
import css from './styles.module.css'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'

const LS_KEY = 'rememberExportedBatches'

type DialogProps = {
  safe: string
  networkPrefix: string
  onClose?: () => void
}

const openSafeApp = (safe: string, networkPrefix: string, safeAppUrl: string) => {
  window.open(
    `https://app.safe.global/apps/open?safe=${networkPrefix}:${safe}&appUrl=${safeAppUrl}`,
    '_blank',
  )
}

const NewDomainBody = ({ safe, networkPrefix, onClose }: DialogProps) => (
  <>
    <Text size="xl" className={css.description}>
      Please make sure to migrate all transaction batches from the{' '}
      <Link onClick={() => openSafeApp(safe, networkPrefix, OLD_TX_BUILDER_URL)} size="xl">
        old Transaction Builder
      </Link>{' '}
      before <b>1st September</b>.
    </Text>
    <Button size="md" onClick={onClose}>
      Got it
    </Button>
  </>
)

const OldDomainBody = ({ safe, networkPrefix }: DialogProps) => (
  <>
    <Text size="xl" className={css.description}>
      Please make sure to export all transaction batches before 1st September in order to import
      them in the{' '}
      <Link onClick={() => openSafeApp(safe, networkPrefix, NEW_TX_BUILDER_URL)} size="xl">
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
  const { safe, sdk } = useSafeAppsSDK()
  const storedValue = localItem<boolean>(LS_KEY).get()
  const [showBanner, setShowBanner] = useState<boolean>(storedValue ?? true)
  const [networkPrefix, setNetworkPrefix] = useState<string>('')

  const handleClose = () => {
    setShowBanner(false)
    localItem(LS_KEY).set(false)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const { shortName } = await sdk.safe.getChainInfo()

        setNetworkPrefix(shortName)
      } catch (e) {
        console.error('Unable to get chain info:', e)
      }
    })()
  }, [sdk])

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
      {isOldDomain ? (
        <OldDomainBody safe={safe.safeAddress} networkPrefix={networkPrefix} />
      ) : (
        <NewDomainBody
          safe={safe.safeAddress}
          networkPrefix={networkPrefix}
          onClose={handleClose}
        />
      )}
    </Paper>
  ) : null
}

export default Banner

const StyledTitle = styled(Title)`
  margin: 16px 0 8px;
`
