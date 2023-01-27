import Box from '@material-ui/core/Box'
import { Tooltip } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { ChainInfo } from '@safe-global/safe-apps-sdk'

import { useSafeWallet } from 'src/store/safeWalletContext'
import useMemoizedTransactionLabel from 'src/hooks/useMemoizedTransactionLabel'

type TransactionLabelProps = {
  address: string
  showFullAddress?: boolean
  ariaLabel?: string
  showCopyIntoClipboardButton?: boolean
  showBlockExplorerLink?: boolean
}

const TransactionLabel = ({
  address,
  showFullAddress,
  ariaLabel,
  showCopyIntoClipboardButton,
  showBlockExplorerLink,
}: TransactionLabelProps) => {
  const addressLabel = useMemoizedTransactionLabel(address, showFullAddress)

  const { chainInfo } = useSafeWallet()

  const blockExplorerLink = getBlockExplorerAddressLink(chainInfo, address)

  return (
    <Box display={'flex'} flexDirection="row" alignItems="center" justifyContent="center">
      <Tooltip placement="top" title={address} backgroundColor="primary" textColor="white" arrow>
        <span>{addressLabel}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip
          title={'Copy transaction address into clipboard'}
          backgroundColor="primary"
          textColor="white"
          arrow
        >
          <StyledIconButton
            aria-label={`Copy ${ariaLabel} to clipboard`}
            onClick={() => navigator?.clipboard?.writeText?.(address)}
            size="small"
          >
            <FileCopyOutlinedIcon fontSize="inherit" />
          </StyledIconButton>
        </Tooltip>
      )}

      {/* Button to block explorer */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip
          title={'view transaction details on block Explorer'}
          backgroundColor="primary"
          textColor="white"
          arrow
        >
          <IconButton
            aria-label={`Show ${ariaLabel} details on block Explorer`}
            component="a"
            href={blockExplorerLink}
            target="_blank"
            rel="noopener"
            size="small"
          >
            <OpenInNewIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default TransactionLabel

const StyledIconButton = styled(IconButton)`
  margin-left: 2px !important;
`

const getBlockExplorerAddressLink = (chainInfo?: ChainInfo, address?: string): string => {
  if (chainInfo && chainInfo.blockExplorerUriTemplate.txHash && address) {
    return chainInfo.blockExplorerUriTemplate.txHash.replace('{{txHash}}', address)
  }

  return ''
}
