import '@testing-library/jest-dom/extend-expect'

// Jest is not able to use this function from node, which is used at viem v1.3.0
// We need to import it manually
import { TextEncoder } from 'util'

global.TextEncoder = TextEncoder
// END

Object.defineProperty(window.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: () => ({
      getTracks: () => [
        // simple MediaStreamTrack stub
        {
          stop: jest.fn(),
        },
      ],
    }),
  },
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(window.HTMLVideoElement.prototype, 'readyState', {
  writable: false,
  value: window.HTMLVideoElement.prototype.HAVE_ENOUGH_DATA,
})

Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  writable: false,
  value: () => {
    return {
      drawImage: jest.fn(),
      getImageData: jest.fn().mockImplementation(() => {
        return {
          data: 'image test data',
          width: 450,
          height: 450,
        }
      }),
    }
  },
})
