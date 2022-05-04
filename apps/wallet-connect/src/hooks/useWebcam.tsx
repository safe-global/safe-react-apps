import { useEffect, useRef, useState } from 'react'

function useWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isLoadingWebcam, setIsLoadingWebcam] = useState(true)
  const [errorConnectingWebcam, setErrorConnectingWebcam] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null
    async function getUserWebcam() {
      setIsLoadingWebcam(true)
      try {
        // see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        stream = await navigator.mediaDevices.getUserMedia({ video: true })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('playsinline', 'true') // required to tell iOS safari we don't want fullscreen
          videoRef.current.play()
          setErrorConnectingWebcam(false)
        }
      } catch (error) {
        setErrorConnectingWebcam(true)
        console.log('Error connecting the camera: ', error)
      }
      setIsLoadingWebcam(false)
    }

    getUserWebcam()

    // closing webcam connection on unmount
    return () => {
      stream?.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop()
      })
    }
  }, [])

  return {
    videoRef,
    isLoadingWebcam,
    errorConnectingWebcam,
  }
}

export default useWebcam
