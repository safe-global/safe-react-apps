import { IconButton, SvgIcon } from '@mui/material'
import type { ReactElement } from 'react'

import CopyIcon from '@/public/images/copy.svg'

export const CopyButton = ({ text }: { text: string }): ReactElement => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <IconButton onClick={handleCopy} size="small">
      <SvgIcon component={CopyIcon} inheritViewBox color="border" fontSize="small" />
    </IconButton>
  )
}
