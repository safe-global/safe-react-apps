import { Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import { shortenAddress } from '@/utils/addresses'
import { DelegateAvatar } from '@/components/DelegateAvatar'
import { SelectedBadge } from '@/components/SelectedBadge'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

import css from './styles.module.css'

export const DelegateCard = ({
  onClick,
  delegate,
  selected,
}: {
  onClick: (delegate: FileDelegate) => void
  delegate: FileDelegate
  selected: boolean
}): ReactElement => {
  return (
    <SelectedBadge invisible={!selected}>
      <Card
        variant="outlined"
        sx={{
          borderColor: ({ palette }) => (selected ? palette.primary.main : undefined),
          width: '100%',
        }}
      >
        <CardActionArea onClick={() => onClick(delegate)}>
          <CardHeader
            avatar={<DelegateAvatar delegate={delegate} />}
            title={delegate.name}
            subheader={delegate.ens || shortenAddress(delegate.address)}
          />

          <CardContent>
            <Typography className={css.reason}>{delegate.reason}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </SelectedBadge>
  )
}
