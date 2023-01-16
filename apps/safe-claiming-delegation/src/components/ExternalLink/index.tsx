import { Link } from '@mui/material'
import type { LinkProps } from '@mui/material'
import type { CSSProperties, ReactElement } from 'react'

import LinkIcon from '@/public/images/link.svg'

const style: CSSProperties = {
  marginLeft: '4px',
}

export const ExternalLink = ({ children, ...props }: LinkProps): ReactElement => {
  return (
    <Link
      rel="noopener noreferrer"
      target="_blank"
      display="inline-flex"
      alignItems="center"
      {...props}
    >
      {children}
      <LinkIcon style={style} />
    </Link>
  )
}
