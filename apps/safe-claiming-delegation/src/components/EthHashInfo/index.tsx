import { Box, Typography } from '@mui/material'
import clsx from 'clsx'
import type { ReactElement } from 'react'

import { shortenAddress } from '@/utils/addresses'
import { Identicon } from '@/components/Identicon'
import { CopyButton } from '@/components/CopyButton'

import css from './styles.module.css'

type EthHashInfoProps = {
  prefix?: string
  address: string
  showAvatar: boolean
  avatarSize?: number
  showCopyButton?: boolean
}

export const EthHashInfo = ({
  prefix,
  address,
  showAvatar,
  avatarSize,
  showCopyButton,
}: EthHashInfoProps): ReactElement => {
  return (
    <div className={css.container}>
      {showAvatar && (
        <div
          className={clsx(css.avatar, {
            [css.resizeAvatar]: !avatarSize,
          })}
        >
          <Identicon address={address} size={avatarSize} />
        </div>
      )}

      <Box className={css.addressRow}>
        <Typography fontWeight="inherit" fontSize="inherit">
          {prefix && <b>{prefix}:</b>}
          {shortenAddress(address)}
        </Typography>

        {showCopyButton && <CopyButton text={address} />}
      </Box>
    </div>
  )
}
