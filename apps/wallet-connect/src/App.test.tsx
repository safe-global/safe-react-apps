import {
  screen,
  fireEvent,
  createEvent,
  waitFor,
  waitForElementToBeRemoved,
  findByAltText,
  findByText,
} from '@testing-library/react'
import App from './App'
import { renderWithProviders } from './utils/test-helpers'

const CONNECTION_INPUT_TEXT = 'QR code or connection link'
const HELP_TITLE = 'How to connect to a Dapp?'

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@gnosis.pm/safe-apps-react-sdk')
  return {
    ...originalModule,
    useSafeAppsSDK: () => ({
      sdk: {
        txs: {
          send: () => {},
          signMessage: () => {},
        },
      },
      safe: {
        safeAddress: '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
        chainId: 4,
      },
    }),
  }
})

jest.mock('@walletconnect/client', () => {
  return function () {
    return {
      peerMeta: {
        name: 'Test name',
        description: 'Test description',
        icons: ['https://cowswap.exchange/./favicon.png'],
        url: 'https://test.dapp.example',
      },
      on: jest.fn(),
      killSession: jest.fn(),
    }
  }
})

jest.mock('jsqr', () => {
  return function () {
    return {
      data: 'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.gnosis.io&key=xxxxxxxxxxx',
    }
  }
})

describe('WalletConnect unit tests', () => {
  it('Renders Wallet Connect Safe App', () => {
    renderWithProviders(<App />)

    const titleNode = screen.getByText('Wallet Connect')

    expect(titleNode).toBeInTheDocument()

    const inputNode = screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)
    expect(inputNode).toBeInTheDocument()

    const instructionsNode = screen.getByText(HELP_TITLE)

    expect(instructionsNode).toBeInTheDocument()
  })

  describe('URI connection', () => {
    it('Connects via onPaste valid URI', () => {
      renderWithProviders(<App />)

      const instructionsNode = screen.getByText(HELP_TITLE)

      expect(instructionsNode).toBeInTheDocument()

      const inputNode = screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)

      const URIPasteEvent = {
        clipboardData: {
          items: [
            {
              kind: 'string',
              type: 'text/plain',
            },
          ],
          getData: () =>
            'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.gnosis.io&key=xxxxxxxxxxx',
        },
      }

      const pasteEvent = createEvent.paste(inputNode, URIPasteEvent)

      fireEvent(inputNode, pasteEvent)

      expect(instructionsNode).not.toBeInTheDocument()

      const connectedNode = screen.getByText('CONNECTED')
      expect(connectedNode).toBeInTheDocument()

      const connectedInstructionsNode = screen.getByText(
        'How to confirm transactions?',
      )
      expect(connectedInstructionsNode).toBeInTheDocument()

      const dappNameNode = screen.getByText('Test name')
      expect(dappNameNode).toBeInTheDocument()

      const dappImgNode = screen.getByRole('img')
      expect(dappImgNode).toBeInTheDocument()
      expect(dappImgNode).toHaveStyle(
        "background-image: url('https://cowswap.exchange/./favicon.png')",
      )
    })

    it('No connection is set if an invalid URI is provided', () => {
      renderWithProviders(<App />)

      const instructionsNode = screen.getByText(HELP_TITLE)

      expect(instructionsNode).toBeInTheDocument()

      const inputNode = screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)

      const URIPasteEvent = {
        clipboardData: {
          items: [
            {
              kind: 'string',
              type: 'text/plain',
            },
          ],
          getData: () => 'Invalid URI',
        },
      }

      const pasteEvent = createEvent.paste(inputNode, URIPasteEvent)

      fireEvent(inputNode, pasteEvent)

      const connectedNode = screen.queryByText('CONNECTED')
      expect(connectedNode).not.toBeInTheDocument()
    })
  })

  describe('Scan QR code connection', () => {
    it('Shows scan QR dialog', async () => {
      renderWithProviders(<App />)

      const openDialogNode = await screen.findByTitle(
        'Start your camera and scan a QR',
      )

      expect(openDialogNode).toBeDefined()

      fireEvent.click(openDialogNode)

      const scanQRCodeDialog = await screen.findByRole('dialog')

      await waitFor(() => expect(scanQRCodeDialog).toBeDefined())
    })

    it('Shows Permissions error image', async () => {
      Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
        writable: true,
        value: jest.fn().mockImplementationOnce(() => {
          throw 'Expected error, testing camera permission error...'
        }),
      })

      renderWithProviders(<App />)

      const openDialogNode = await screen.findByTitle(
        'Start your camera and scan a QR',
      )

      expect(openDialogNode).toBeInTheDocument()

      fireEvent.click(openDialogNode)

      const scanQRCodeDialog = await screen.findByRole('dialog')

      expect(scanQRCodeDialog).toBeDefined()

      const permissionErrorTitle = await findByText(
        scanQRCodeDialog,
        'Check browser permissions',
      )

      expect(permissionErrorTitle).toBeDefined()

      const permissionErrorImg = await findByAltText(
        scanQRCodeDialog,
        'camera permission error',
      )
      expect(permissionErrorImg).toBeDefined()
    })

    it('Scans valid QR code', async () => {
      renderWithProviders(<App />)

      const openDialogNode = await screen.findByTitle(
        'Start your camera and scan a QR',
      )

      fireEvent.click(openDialogNode)

      const scanQRCodeDialog = await screen.findByRole('dialog')
      expect(scanQRCodeDialog).toBeDefined()

      const dappNameNode = await screen.findByText('Test name')
      expect(dappNameNode).toBeInTheDocument()

      const dappImgNode = await screen.findByRole('img')
      expect(dappImgNode).toBeInTheDocument()
      expect(dappImgNode).toHaveStyle(
        "background-image: url('https://cowswap.exchange/./favicon.png')",
      )
    })

    it('Closes webcam connection by closing the dialog', async () => {
      const stopWebcamSpy = jest.fn()

      const openWebcamSpy = jest.fn().mockImplementation(() => ({
        getTracks: () => [
          {
            stop: stopWebcamSpy,
          },
        ],
      }))

      Object.defineProperty(window.navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: openWebcamSpy,
        },
      })

      Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
        writable: false,
        value: () => {
          return {
            drawImage: jest.fn(),
            getImageData: jest.fn(),
          }
        },
      })

      renderWithProviders(<App />)

      expect(openWebcamSpy).not.toHaveBeenCalled()
      expect(stopWebcamSpy).not.toHaveBeenCalled()

      const openDialogNode = await screen.findByTitle(
        'Start your camera and scan a QR',
      )

      // we open webcam dialog
      fireEvent.click(openDialogNode)

      const scanQRCodeDialog = await screen.findByRole('dialog')
      expect(scanQRCodeDialog).toBeDefined()

      // only webcam connection should be called at this point of the test
      expect(openWebcamSpy).toHaveBeenCalled()
      expect(stopWebcamSpy).not.toHaveBeenCalled()

      // we close webcam dialog
      const closeQRCodeDialogButton = screen.getByLabelText(
        'Close scan QR code dialog',
      )

      expect(closeQRCodeDialogButton).toBeInTheDocument()
      fireEvent.click(closeQRCodeDialogButton)

      await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))

      // webcam connection should be closed
      expect(stopWebcamSpy).toHaveBeenCalled()
    })
  })

  describe('Disconnect WC', () => {
    it('Disconnects if user clicks on Disconnect button', () => {
      renderWithProviders(<App />)

      const instructionsNode = screen.getByText(HELP_TITLE)

      expect(instructionsNode).toBeInTheDocument()

      const inputNode = screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)

      const URIPasteEvent = {
        clipboardData: {
          items: [
            {
              kind: 'string',
              type: 'text/plain',
            },
          ],
          getData: () =>
            'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.gnosis.io&key=xxxxxxxxxxx',
        },
      }

      const pasteEvent = createEvent.paste(inputNode, URIPasteEvent)

      fireEvent(inputNode, pasteEvent)

      const disconnectButtonNode = screen.getByText('Disconnect')
      expect(disconnectButtonNode).toBeInTheDocument()

      fireEvent.click(disconnectButtonNode)

      waitFor(() => {
        expect(inputNode).toBeInTheDocument()
        expect(instructionsNode).toBeInTheDocument()
      })
    })
  })
})
