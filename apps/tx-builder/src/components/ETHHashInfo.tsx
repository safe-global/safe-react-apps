import React, { useState } from 'react'
import styled from 'styled-components'

import { BreakpointDefaults } from '@material-ui/core/styles/createBreakpoints'
import { textShortener } from '../utils/strings'
import { EllipsisMenuItem } from '@gnosis.pm/safe-react-components'
import Text from './Text'
import { Theme } from '@material-ui/core'
import ExplorerButton from './buttons/ExplorerButton'
import Identicon, { identiconSizes } from './buttons/Identicon'
import CopyToClipboardBtn from './buttons/CopyToClipboardBtn'
import EllipsisMenu from './EllipsisMenu'

export type ExplorerInfo = () => { url: string; alt: string }

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`

const AvatarContainer = styled.div`
  display: flex;
  margin-right: 8px;
`

const InfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledImg = styled.img<{ size: keyof typeof identiconSizes }>`
  height: ${({ size }) => identiconSizes[size]};
  width: ${({ size }) => identiconSizes[size]};
`

type Props = {
  className?: string
  hash: string
  showHash?: boolean
  shortenHash?: number
  name?: string
  strongName?: boolean
  textColor?: keyof Theme['palette']
  textSize?: keyof BreakpointDefaults
  showAvatar?: boolean
  customAvatar?: string
  customAvatarFallback?: string
  avatarSize?: keyof BreakpointDefaults
  showCopyBtn?: boolean
  menuItems?: EllipsisMenuItem[]
  explorerUrl?: ExplorerInfo
}

type ShortNameProps =
  | {
      shouldShowShortName: boolean
      shouldCopyShortName?: boolean
      shortName: string
    }
  | {
      shouldShowShortName?: boolean
      shouldCopyShortName: boolean
      shortName: string
    }
  | {
      shouldShowShortName?: never
      shouldCopyShortName?: never
      shortName?: string
    }

type EthHashInfoProps = Props & ShortNameProps

const EthHashInfo = ({
  hash,
  showHash = true,
  name,
  className,
  shortenHash,
  showAvatar,
  customAvatar,
  customAvatarFallback,
  avatarSize = 'md',
  showCopyBtn,
  menuItems,
  explorerUrl,
  shortName,
  shouldShowShortName,
  shouldCopyShortName,
}: EthHashInfoProps): React.ReactElement => {
  const [fallbackToIdenticon, setFallbackToIdenticon] = useState(false)
  const [fallbackSrc, setFallabckSrc] = useState<undefined | string>(undefined)

  const setAppImageFallback = (): void => {
    if (customAvatarFallback && !fallbackToIdenticon) {
      setFallabckSrc(customAvatarFallback)
    } else {
      setFallbackToIdenticon(true)
    }
  }

  return (
    <StyledContainer className={className}>
      {showAvatar && (
        <AvatarContainer>
          {!fallbackToIdenticon && customAvatar ? (
            <StyledImg
              src={fallbackSrc || customAvatar}
              size={avatarSize}
              onError={setAppImageFallback}
            />
          ) : (
            <Identicon address={hash} size={avatarSize} />
          )}
        </AvatarContainer>
      )}

      <InfoContainer>
        {name && <Text>{name}</Text>}
        <AddressContainer>
          {showHash && (
            <Text>
              {shouldShowShortName && (
                <Text component="span" strong>
                  {shortName}:
                </Text>
              )}
              {shortenHash ? textShortener(hash, shortenHash + 2, shortenHash) : hash}
            </Text>
          )}
          {showCopyBtn && (
            <CopyToClipboardBtn textToCopy={shouldCopyShortName ? `${shortName}:${hash}` : hash} />
          )}
          {explorerUrl && <ExplorerButton explorerUrl={explorerUrl} />}
          {menuItems && <EllipsisMenu menuItems={menuItems} />}
        </AddressContainer>
      </InfoContainer>
    </StyledContainer>
  )
}

export default EthHashInfo
