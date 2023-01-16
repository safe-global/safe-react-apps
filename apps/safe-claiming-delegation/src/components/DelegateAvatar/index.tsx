import { Avatar } from '@mui/material'
import type { ReactElement } from 'react'

import { GUARDIANS_IMAGE_URL } from '@/config/constants'
import type { Delegate } from '@/hooks/useDelegate'

export const DelegateAvatar = ({ delegate }: { delegate: Delegate }): ReactElement => {
  return (
    <Avatar
      variant="circular"
      src={`${GUARDIANS_IMAGE_URL}/${delegate.address}_1x.png`}
      alt={'name' in delegate ? delegate.name : delegate.address}
    />
  )
}
