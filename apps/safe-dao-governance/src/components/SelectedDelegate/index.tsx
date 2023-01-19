import { Button, Card, CardHeader, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { DelegateAvatar } from '@/components/DelegateAvatar'
import Avatar from '@/public/images/avatar.svg'
import { InfoAlert } from '@/components/InfoAlert'
import { shortenAddress } from '@/utils/addresses'
import type { Delegate } from '@/hooks/useDelegate'

export const SelectedDelegate = ({
  onClick,
  delegate,
  disabled,
  hint = false,
}: {
  delegate?: Delegate
  onClick?: () => void
  disabled?: boolean
  hint?: boolean
}): ReactElement => {
  return (
    <>
      <Typography color="text.secondary" alignSelf="flex-start" mb={1}>
        Delegating to
      </Typography>
      <Card variant="outlined" elevation={0}>
        <CardHeader
          avatar={delegate ? <DelegateAvatar delegate={delegate} /> : <Avatar />}
          title={
            delegate
              ? 'name' in delegate
                ? delegate.name
                : shortenAddress(delegate.address)
              : 'No delegate chosen'
          }
          titleTypographyProps={{
            color: !delegate ? 'text.secondary' : undefined,
          }}
          subheader={delegate && 'ens' in delegate ? delegate.ens : undefined}
          action={
            onClick && (
              <Button variant="contained" size="stretched" onClick={onClick} disabled={disabled}>
                {delegate ? 'Redelegate' : 'Delegate'}
              </Button>
            )
          }
        />
      </Card>
      {hint && (
        <InfoAlert mt={2}>
          <Typography>
            You only delegate your voting power and not the ownership of your tokens.
          </Typography>
        </InfoAlert>
      )}
    </>
  )
}
