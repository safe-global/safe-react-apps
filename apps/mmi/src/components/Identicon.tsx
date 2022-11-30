import { useMemo } from 'react'
import { Avatar } from '@mui/material'
import makeBlockie from 'ethereum-blockies-base64'

type IdenticonProps = {
  address: string
  size?: number
}

const Identicon = ({ address, size = 32 }: IdenticonProps): React.ReactElement => {
  const iconSrc = useMemo(() => makeBlockie(address), [address])

  return <Avatar src={iconSrc} alt={address} sx={{ width: size, height: size }} />
}

export default Identicon
