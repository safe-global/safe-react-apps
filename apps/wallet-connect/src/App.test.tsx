import {
  screen,
  fireEvent,
  createEvent,
  waitFor,
  waitForElementToBeRemoved,
  findByAltText,
  findByText,
} from '@testing-library/react'
import { SignClientTypes } from '@walletconnect/types'

import App from './App'
import { safeAllowedEvents, safeAllowedMethods } from './hooks/useWalletConnectV2'
import {
  mockChainInfo,
  mockOriginUrl,
  mockSafeAppsListResponse,
  mockSafeInfo,
  mockSessionProposal,
  mockV2SessionObj,
} from './mocks/mocks'
import { renderWithProviders } from './utils/test-helpers'

const CONNECTION_INPUT_TEXT = 'QR code or connection link'
const HELP_TITLE = 'How to connect to a Dapp?'

const version1URI =
  'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.safe.global&key=xxxxxxxxxxx'

const version2URI =
  'wc:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@2?relay-protocol=irn&symKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => {
  return {
    getSafeApps: () => Promise.resolve(mockSafeAppsListResponse),
  }
})

jest.mock('./utils/analytics', () => ({
  trackSafeAppEvent: jest.fn(),
}))

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

const mockPairing = jest.fn()
const mockWalletconnectEvent = jest.fn()
const mockReject = jest.fn()
const mockApprove = jest.fn()
const mockRespond = jest.fn()
const mockDisconnect = jest.fn()

// walletconnect version 2 mock
jest.mock('@walletconnect/sign-client', () => {
  return {
    init: () => ({
      // default session:
      session: { getAll: () => [] },
      on: mockWalletconnectEvent,
      reject: mockReject,
      approve: mockApprove,
      respond: mockRespond,
      // pair connection request
      core: {
        pairing: {
          pair: mockPairing,
        },
      },
      // disconnect
      disconnect: mockDisconnect,
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
  beforeEach(() => {
    mockPairing.mockClear()
    mockWalletconnectEvent.mockClear()
    mockReject.mockClear()
    mockApprove.mockClear()
    mockRespond.mockClear()
    mockDisconnect.mockClear()
  })

  it('Renders Walletconnect Safe App', async () => {
    renderWithProviders(<App />)

    // wait for loader to be removed
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

    // wait for loader to be removed
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
        throw 'This is an Expected error, just testing camera permission error...'
      }),
    })

    renderWithProviders(<App />)

    // wait for loader to be removed
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

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        const instructionsNode = screen.getByText(HELP_TITLE)

        expect(instructionsNode).toBeInTheDocument()

        pasteWalletConnectURI(version1URI)

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

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        const instructionsNode = screen.getByText(HELP_TITLE)

        expect(instructionsNode).toBeInTheDocument()

        pasteWalletConnectURI('Invalid version 1 URI')

        const connectedNode = screen.queryByText('CONNECTED')
        expect(connectedNode).not.toBeInTheDocument()
      })
    })

    it('Scans a valid v1 QR code', async () => {
      renderWithProviders(<App />)

      // wait for loader to be removed
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

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        const instructionsNode = screen.getByText(HELP_TITLE)

        expect(instructionsNode).toBeInTheDocument()

        pasteWalletConnectURI(version1URI)

        const disconnectButtonNode = screen.getByText('Disconnect')
        expect(disconnectButtonNode).toBeInTheDocument()

        fireEvent.click(disconnectButtonNode)

        waitFor(() => {
          expect(instructionsNode).toBeInTheDocument()
          expect(screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Walletconnect version 2', () => {
    it('Pairing via valid v2 URI', async () => {
      renderWithProviders(<App />)

      // wait for loader to be removed
      await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

      const instructionsNode = screen.getByText(HELP_TITLE)

      expect(instructionsNode).toBeInTheDocument()

      expect(mockPairing).not.toBeCalled()

      pasteWalletConnectURI(version2URI)

      expect(mockPairing).toBeCalledWith({ uri: version2URI })
    })

    it('Session Proposal event', async () => {
      let sessionProposalEvent = (
        proposal: SignClientTypes.EventArguments['session_proposal'],
      ) => {}

      mockWalletconnectEvent.mockImplementation((eventType, callback) => {
        if (eventType === 'session_proposal') {
          sessionProposalEvent = callback
        }
      })

      mockApprove.mockImplementation(() => {
        return {
          acknowledged: () => Promise.resolve(mockV2SessionObj),
        }
      })

      renderWithProviders(<App />)

      // wait for loader to be removed
      await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

      expect(mockApprove).not.toBeCalled()
      expect(mockReject).not.toBeCalled()

      // simulate a session proposal event
      sessionProposalEvent(mockSessionProposal)

      const dappNameNode = await screen.findByText('Test v2 Dapp name')
      expect(dappNameNode).toBeInTheDocument()

      // no rejection is present in valid sessions
      expect(mockReject).not.toBeCalled()

      const safeAccount = [`eip155:${mockSafeInfo.chainId}:${mockSafeInfo.safeAddress}`]

      // approved session is sent
      expect(mockApprove).toBeCalledWith({
        id: mockSessionProposal.id,
        namespaces: {
          eip155: {
            accounts: safeAccount,
            methods: safeAllowedMethods,
            events: safeAllowedEvents,
          },
        },
      })
    })
  })

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

    // wait for loader to be removed
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

// helper function to populate the input with the URI unsing an onPaste event
const pasteWalletConnectURI = (uri: string) => {
  const inputNode = screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)

  const URIPasteEvent = {
    clipboardData: {
      items: [
        {
          kind: 'string',
          type: 'text/plain',
        },
      ],
      getData: () => uri,
    },
  }

  const pasteEvent = createEvent.paste(inputNode, URIPasteEvent)

  fireEvent(inputNode, pasteEvent)
}
