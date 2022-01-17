import { useEffect, useRef, useState } from 'react';

function useWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoadingWebcam, setIsLoadingWebcam] = useState(true);
  const [errorConnectingWebcam, setErrorConnectingWebcam] = useState(false);

  useEffect(() => {
    async function getUserWebcam() {
      setIsLoadingWebcam(true);
      try {
        // see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
          videoRef.current.play();
          setErrorConnectingWebcam(false);
        }
      } catch (error) {
        setErrorConnectingWebcam(true);
        console.log('Error connecting the camera: ', error);
      }
      setIsLoadingWebcam(false);
    }

    getUserWebcam();
  }, []);

  return {
    videoRef,
    isLoadingWebcam,
    errorConnectingWebcam,
  };
}

export default useWebcam;
