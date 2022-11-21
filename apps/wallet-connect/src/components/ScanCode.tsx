import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Loader, Title, Text } from '@gnosis.pm/safe-react-components'

import useWebcam from '../hooks/useWebcam'
import useQRCode from '../hooks/useQRCode'
import ErrorImg from '../assets/cam-permissions.png'
import { useWalletConnectType, wcConnectType } from '../hooks/useWalletConnect'

type Props = {
  wcConnect: wcConnectType
  wcClientData: useWalletConnectType['wcClientData']
}

function ScanCode({ wcConnect, wcClientData }: Props) {
  const { videoRef, isLoadingWebcam, errorConnectingWebcam } = useWebcam()

  const { QRCode } = useQRCode({ videoRef, errorConnectingWebcam })

  // this flag is needed to avoid to call multiple times to wcConnect
  const [hasBeenCalledToConnect, setHasBeenCalledToConnect] = useState(false)

  const isAlreadyConnected = !!wcClientData

  useEffect(() => {
    if (QRCode) {
      const isValidWalletConnectQRCode = QRCode && QRCode.data.startsWith('wc')

      if (isValidWalletConnectQRCode && !isAlreadyConnected && !hasBeenCalledToConnect) {
        wcConnect(QRCode.data)
        setHasBeenCalledToConnect(true)
      }
    }
  }, [QRCode, wcConnect, isAlreadyConnected, hasBeenCalledToConnect])

  const showVideo = !errorConnectingWebcam && !isLoadingWebcam

  return (
    <>
      <video
        ref={videoRef}
        height={450}
        width={450}
        hidden={!showVideo}
        style={{
          objectFit: 'cover',
        }}
      />
      {errorConnectingWebcam && (
        <StyledErrorContainer>
          <StyledErrorTitle size="sm">Check browser permissions</StyledErrorTitle>
          <img src={ErrorImg} alt="camera permission error" />
        </StyledErrorContainer>
      )}
      {isLoadingWebcam && (
        <div>
          <StyledLoaderContainer>
            <Loader size="md" />
            <StyledLoaderText size="md">Loading Camera...</StyledLoaderText>
          </StyledLoaderContainer>
        </div>
      )}
      {showVideo && <StyledVideoBorder />}
    </>
  )
}

export default ScanCode

const StyledVideoBorder = styled.div`
  top: 0px;
  left: 0px;
  z-index: 1;
  box-sizing: border-box;
  border: 100px solid rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%;
  height: 100%;

  background: linear-gradient(to right, black 6px, transparent 6px) 0 0,
    linear-gradient(to right, black 6px, transparent 6px) 0 100%,
    linear-gradient(to left, black 6px, transparent 6px) 100% 0,
    linear-gradient(to left, black 6px, transparent 6px) 100% 100%,
    linear-gradient(to bottom, black 6px, transparent 6px) 0 0,
    linear-gradient(to bottom, black 6px, transparent 6px) 100% 0,
    linear-gradient(to top, black 6px, transparent 6px) 0 100%,
    linear-gradient(to top, black 6px, transparent 6px) 100% 100%;

  background-repeat: no-repeat;
  background-size: 40px 40px;
`

const StyledLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  min-width: 200px;
  min-height: 200px;
`

const StyledLoaderText = styled(Text)`
  margin-top: 12px;
`

const StyledErrorContainer = styled.div`
  padding: 20px;
`

const StyledErrorTitle = styled(Title)`
  margin-top: 0;
`
