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
import { mockChainInfo, mockOriginUrl, mockSafeAppsListResponse, mockSafeInfo } from './mocks/mocks'
import { renderWithProviders } from './utils/test-helpers'

const CONNECTION_INPUT_TEXT = 'QR code or connection link'
const HELP_TITLE = 'How to connect to a Dapp?'

// TODO: create a input type URI test

// TODO: create version 2 URI
const version1URI =
  'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.safe.global&key=xxxxxxxxxxx'

jest.mock('./utils/analytics', () => ({
  trackSafeAppEvent: (event: any) => {
    console.log('@@@@@ trackSafeAppEvent! ', event)
  },
}))

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => {
  return {
    getSafeApps: () => Promise.resolve(mockSafeAppsListResponse),
  }
})

jest.mock('@gnosis.pm/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@gnosis.pm/safe-apps-react-sdk')
  return {
    ...originalModule,
    useSafeAppsSDK: () => ({
      sdk: {
        txs: {
          send: jest.fn(),
          signMessage: jest.fn(),
        },
        safe: {
          getChainInfo: () => Promise.resolve(mockChainInfo),
          getEnvironmentInfo: () => Promise.resolve(mockOriginUrl),
        },
      },
      safe: mockSafeInfo,
    }),
  }
})

// walletconnect version 1 mock
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
      approveSession: jest.fn(),
      approveRequest: jest.fn(),
    }
  }
})

// walletconnect version 2 mock
jest.mock('@walletconnect/sign-client', () => {
  return {
    init: () => ({
      // default session:
      session: { getAll: () => [] },
      // on session request:
      on: jest.fn(),
      reject: jest.fn(),
      approve: jest.fn(),
      respond: jest.fn(),
      // pair connection request
      core: {
        pairing: {
          pair: jest.fn(),
        },
      },
      // disconnect
      disconnect: jest.fn(),
    }),
  }
})

// QR code lib mock
jest.mock('jsqr', () => {
  return function () {
    return {
      data: version1URI,
    }
  }
})

describe('Walletconnect unit tests', () => {
  it('Renders Walletconnect Safe App', async () => {
    renderWithProviders(<App />)

    // wait for loader is removed
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    const titleNode = screen.getByText('Wallet Connect')

    expect(titleNode).toBeInTheDocument()

    const inputNode = screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)
    expect(inputNode).toBeInTheDocument()

    const instructionsNode = screen.getByText(HELP_TITLE)

    expect(instructionsNode).toBeInTheDocument()
  })

  it('Shows scan QR dialog', async () => {
    renderWithProviders(<App />)

    // wait for loader is removed
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    const openDialogNode = await screen.findByTitle('Start your camera and scan a QR')

    expect(openDialogNode).toBeDefined()

    fireEvent.click(openDialogNode)

    const scanQRCodeDialog = await screen.findByRole('dialog')

    await waitFor(() => expect(scanQRCodeDialog).toBeDefined())
  })

  it('Shows Camera Permissions error', async () => {
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
      writable: true,
      value: jest.fn().mockImplementationOnce(() => {
        throw 'Expected error, testing camera permission error...'
      }),
    })

    renderWithProviders(<App />)

    // wait for loader is removed
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    const openDialogNode = await screen.findByTitle('Start your camera and scan a QR')

    expect(openDialogNode).toBeInTheDocument()

    fireEvent.click(openDialogNode)

    const scanQRCodeDialog = await screen.findByRole('dialog')

    expect(scanQRCodeDialog).toBeDefined()

    const permissionErrorTitle = await findByText(scanQRCodeDialog, 'Check browser permissions')

    expect(permissionErrorTitle).toBeDefined()

    const permissionErrorImg = await findByAltText(scanQRCodeDialog, 'camera permission error')
    expect(permissionErrorImg).toBeDefined()
  })

  describe('Walletconnect version 1', () => {
    describe('v1 URI connection', () => {
      it('Connects via onPaste valid v1 URI', async () => {
        renderWithProviders(<App />)

        // wait for loader is removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

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
            getData: () => version1URI,
          },
        }

        const pasteEvent = createEvent.paste(inputNode, URIPasteEvent)

        fireEvent(inputNode, pasteEvent)

        expect(instructionsNode).not.toBeInTheDocument()

        const connectedNode = screen.getByText('CONNECTED')
        expect(connectedNode).toBeInTheDocument()

        const connectedInstructionsNode = screen.getByText('How to confirm transactions?')
        expect(connectedInstructionsNode).toBeInTheDocument()

        const dappNameNode = screen.getByText('Test name')
        expect(dappNameNode).toBeInTheDocument()

        const dappImgNode = screen.getByRole('img')
        expect(dappImgNode).toBeInTheDocument()
        expect(dappImgNode).toHaveStyle(
          "background-image: url('https://cowswap.exchange/./favicon.png')",
        )
      })

      it('No connection is created if an invalid v1 URI is provided', async () => {
        renderWithProviders(<App />)

        // wait for loader is removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

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
            getData: () => 'Invalid version 1 URI',
          },
        }

        const pasteEvent = createEvent.paste(inputNode, URIPasteEvent)

        fireEvent(inputNode, pasteEvent)

        const connectedNode = screen.queryByText('CONNECTED')
        expect(connectedNode).not.toBeInTheDocument()
      })
    })

    it('Scans a valid v1 QR code', async () => {
      renderWithProviders(<App />)

      // wait for loader is removed
      await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

      const openDialogNode = await screen.findByTitle('Start your camera and scan a QR')

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

    describe('Disconnect v1 session', () => {
      it('Disconnects if user clicks on Disconnect button', async () => {
        renderWithProviders(<App />)

        // wait for loader is removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

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
            getData: () => version1URI,
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

  // TODO: ADD Version 2 tests
  // describe('Walletconnect version 2', () => {
  //   // TODO
  // })

  // TODO: check mockrestore here
  it('Closes webcam connection by closing the QR dialog', async () => {
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

    // wait for loader is removed
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(openWebcamSpy).not.toHaveBeenCalled()
    expect(stopWebcamSpy).not.toHaveBeenCalled()

    const openDialogNode = await screen.findByTitle('Start your camera and scan a QR')

    // we open webcam dialog
    fireEvent.click(openDialogNode)

    const scanQRCodeDialog = await screen.findByRole('dialog')
    expect(scanQRCodeDialog).toBeDefined()

    // only webcam connection should be called at this point of the test
    expect(openWebcamSpy).toHaveBeenCalled()
    expect(stopWebcamSpy).not.toHaveBeenCalled()

    // we close webcam dialog
    const closeQRCodeDialogButton = screen.getByLabelText('Close scan QR code dialog')

    expect(closeQRCodeDialogButton).toBeInTheDocument()
    fireEvent.click(closeQRCodeDialogButton)

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))

    // webcam connection should be closed
    expect(stopWebcamSpy).toHaveBeenCalled()
  })
})
