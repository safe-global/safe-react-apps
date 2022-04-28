import { useEffect, useState } from 'react'
import jsQR, { QRCode } from 'jsqr'

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>
  errorConnectingWebcam: boolean
}

function useQRCode({ videoRef, errorConnectingWebcam }: Props) {
  const [QRCode, setQRCode] = useState<QRCode | null>(null)

  useEffect(() => {
    if (videoRef.current && !errorConnectingWebcam) {
      const canvas = document.createElement('canvas')
      requestAnimationFrame(function QRCodeFromFrame() {
        const QRCode = getQRCode(videoRef.current as HTMLVideoElement, canvas)

        const isValidQR = QRCode && QRCode.data
        // if invalid QR we try to read it again until returns a valid one
        if (isValidQR) {
          setQRCode(QRCode)
        } else {
          requestAnimationFrame(QRCodeFromFrame)
        }
      })
    }
  }, [videoRef, errorConnectingWebcam])

  return {
    QRCode,
  }
}

export default useQRCode

function getQRCode(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const currentFrame = video && getCurrentVideoFrame(video, canvas)
  if (currentFrame) {
    const QRCode = jsQR(currentFrame.data, currentFrame.width, currentFrame.height, {
      inversionAttempts: 'dontInvert',
    })

    if (QRCode) {
      return QRCode
    }
  }
}

function getCurrentVideoFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const isVideoReady = video && video.readyState === video.HAVE_ENOUGH_DATA

  if (!isVideoReady) {
    return
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const canvasContext = canvas.getContext('2d')
  canvasContext?.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvasContext?.getImageData(0, 0, canvas.width, canvas.height)
}
