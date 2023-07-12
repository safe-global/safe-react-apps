import {
  screen,
  fireEvent,
  createEvent,
  waitFor,
  waitForElementToBeRemoved,
  findByAltText,
  findByText,
  act,
} from '@testing-library/react'
import { SignClientTypes } from '@walletconnect/types'

import WalletconnectSafeApp from './App'
import {
  mockActiveSessions,
  mockChainInfo,
  mockInvalidChainIdSessionProposal,
  mockInvalidChainTransactionRequest,
  mockInvalidEVMSessionProposal,
  mockOriginUrl,
  mockSafeAppsListResponse,
  mockSafeInfo,
  mockSessionProposal,
  mockV2SessionObj,
  mockValidTransactionRequest,
} from './mocks/mocks'
import { renderWithProviders } from './utils/test-helpers'
import { compatibleSafeMethods, errorLabel } from './hooks/useWalletConnectV2'

const CONNECTION_INPUT_TEXT = 'QR code or connection link'
const HELP_TITLE = 'How to connect to a Dapp?'

const version1URI =
  'wc:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@1?bridge=wss://safe-walletconnect.safe.global&key=xxxxxxxxxxx'

const version2URI =
  'wc:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@2?relay-protocol=irn&symKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

jest.mock('@safe-global/safe-gateway-typescript-sdk', () => {
  return {
    getSafeApps: () => Promise.resolve(mockSafeAppsListResponse),
  }
})

jest.mock('./utils/analytics', () => ({
  trackSafeAppEvent: jest.fn(),
}))

jest.mock('@safe-global/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@safe-global/safe-apps-react-sdk')
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

const mockWalletconnectEvent = jest.fn()
const mockRespondSessionRequest = jest.fn()
const mockGetActiveSessions = jest.fn()
const mockRejectSession = jest.fn()
const mockApproveSession = jest.fn()
const mockDisconnectSession = jest.fn()
const mockPairing = jest.fn()
const mockEmitSessionEvent = jest.fn()

// walletconnect version 2 mock
jest.mock('@walletconnect/web3wallet', () => {
  return {
    Web3Wallet: {
      init: () => ({
        on: mockWalletconnectEvent,
        respondSessionRequest: mockRespondSessionRequest,
        getActiveSessions: mockGetActiveSessions,
        rejectSession: mockRejectSession,
        approveSession: mockApproveSession,
        disconnectSession: mockDisconnectSession,
        emitSessionEvent: mockEmitSessionEvent,
        core: {
          pairing: {
            pair: mockPairing,
          },
        },
      }),
    },
  }
})

jest.mock('@walletconnect/core', () => {
  return {
    Core: function () {},
  }
})

// web3 mock
const mockWeb3Stub = { send: jest.fn() }

jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers')
  return {
    ...originalModule,
    ethers: {
      ...originalModule.ethers,
      providers: {
        Web3Provider: function () {
          return mockWeb3Stub
        },
      },
    },
  }
})

const mockQRcodeStub = jest.fn()

// QR code lib mock
jest.mock('jsqr', () => {
  return function () {
    return mockQRcodeStub()
  }
})

describe('Walletconnect unit tests', () => {
  beforeEach(() => {
    mockPairing.mockClear()
    mockWalletconnectEvent.mockClear()
    mockRespondSessionRequest.mockClear()
    mockRejectSession.mockClear()
    mockApproveSession.mockClear()
    mockDisconnectSession.mockClear()
    mockGetActiveSessions.mockClear()
    mockGetActiveSessions.mockImplementation(() => ({}))
    mockQRcodeStub.mockClear()
    mockWeb3Stub.send.mockClear()
  })

  it('Renders Walletconnect Safe App', async () => {
    renderWithProviders(<WalletconnectSafeApp />)

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
    renderWithProviders(<WalletconnectSafeApp />)

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

    renderWithProviders(<WalletconnectSafeApp />)

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
        renderWithProviders(<WalletconnectSafeApp />)

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
        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        pasteWalletConnectURI('Invalid version 1 URI')

        // no connected label is present
        expect(screen.queryByText('CONNECTED')).not.toBeInTheDocument()
      })
    })

    it('Scans a valid v1 QR code', async () => {
      renderWithProviders(<WalletconnectSafeApp />)

      // we simulate a valid v1 URI returned by the QR lib
      mockQRcodeStub.mockImplementation(() => ({
        data: version1URI,
      }))

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
        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        const instructionsNode = screen.getByText(HELP_TITLE)

        expect(instructionsNode).toBeInTheDocument()

        pasteWalletConnectURI(version1URI)

        const disconnectButtonNode = screen.getByText('Disconnect')
        expect(disconnectButtonNode).toBeInTheDocument()

        fireEvent.click(disconnectButtonNode)

        await waitFor(() => {
          expect(screen.getByText(HELP_TITLE)).toBeInTheDocument()
          expect(screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Walletconnect version 2', () => {
    describe('pairing', () => {
      it('Pairing via valid v2 URI', async () => {
        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockPairing).not.toBeCalled()

        pasteWalletConnectURI(version2URI)

        expect(mockPairing).toBeCalledWith({ uri: version2URI })
      })
    })

    describe('session proposal', () => {
      it('valid Session Proposal event', async () => {
        let fireSessionProposalEvent = (
          proposal: SignClientTypes.EventArguments['session_proposal'],
        ) => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_proposal') {
            fireSessionProposalEvent = callback
          }
        })

        mockApproveSession.mockImplementation(() => {
          return Promise.resolve(mockV2SessionObj)
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockApproveSession).not.toBeCalled()
        expect(mockRejectSession).not.toBeCalled()

        // simulate a session proposal event
        act(() => {
          fireSessionProposalEvent(mockSessionProposal)
        })

        const dappNameNode = await screen.findByText('Test v2 Dapp name')
        expect(dappNameNode).toBeInTheDocument()

        // no rejection is present in valid sessions
        expect(mockRejectSession).not.toBeCalled()

        // No error label is present
        expect(screen.queryByText(errorLabel)).not.toBeInTheDocument()

        const safeAccount = [`eip155:${mockSafeInfo.chainId}:${mockSafeInfo.safeAddress}`]
        const safeChain = [`eip155:${mockSafeInfo.chainId}`]

        // approved session is sent
        expect(mockApproveSession).toBeCalledWith({
          id: mockSessionProposal.id,
          namespaces: {
            eip155: {
              accounts: safeAccount,
              methods: compatibleSafeMethods,
              events: mockSessionProposal.params.requiredNamespaces.eip155.events,
              chains: safeChain,
            },
          },
        })
      })

      it('rejects session proposals without a EVM based namespace', async () => {
        let fireSessionProposalEvent = (
          proposal: SignClientTypes.EventArguments['session_proposal'],
        ) => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_proposal') {
            fireSessionProposalEvent = callback
          }
        })

        mockApproveSession.mockImplementation(() => {
          return Promise.reject()
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockApproveSession).not.toBeCalled()
        expect(mockRejectSession).not.toBeCalled()

        // simulate an invalid EVM compatible session proposal event
        act(() => {
          fireSessionProposalEvent(mockInvalidEVMSessionProposal)
        })

        // error label to provide feedback to the user
        await waitFor(() => expect(screen.getByText(errorLabel)).toBeInTheDocument())

        const safeAccount = [`eip155:${mockSafeInfo.chainId}:${mockSafeInfo.safeAddress}`]
        const safeChain = [`eip155:${mockSafeInfo.chainId}`]

        // we try to connect
        expect(mockApproveSession).toHaveBeenCalledWith({
          id: 1111111111111111,
          namespaces: {
            eip155: {
              accounts: safeAccount,
              chains: safeChain,
              events: [],
              methods: compatibleSafeMethods,
            },
          },
        })

        expect(mockRejectSession).toBeCalled()
      })

      it('rejects session proposals without Safe chain', async () => {
        let fireSessionProposalEvent = (
          proposal: SignClientTypes.EventArguments['session_proposal'],
        ) => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_proposal') {
            fireSessionProposalEvent = callback
          }
        })

        mockApproveSession.mockImplementation(() => {
          return Promise.reject({
            message: 'chains', // wallet connect rejects the connection now
          })
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockApproveSession).not.toBeCalled()
        expect(mockRejectSession).not.toBeCalled()

        // simulate an invalid session proposal event (no Safe chain is present)
        act(() => {
          fireSessionProposalEvent(mockInvalidChainIdSessionProposal)
        })

        // error label to provide feedback to the user
        await waitFor(() => expect(screen.getByText(errorLabel)).toBeInTheDocument())

        const safeAccount = [`eip155:${mockSafeInfo.chainId}:${mockSafeInfo.safeAddress}`]
        const safeChain = [`eip155:${mockSafeInfo.chainId}`]

        // we try to connect
        expect(mockApproveSession).toHaveBeenCalledWith({
          id: 1111111111111111,
          namespaces: {
            eip155: {
              accounts: safeAccount,
              chains: safeChain,
              events: [],
              methods: compatibleSafeMethods,
            },
          },
        })

        expect(mockRejectSession).toBeCalled()
      })
    })

    describe('transaction proposal', () => {
      it('acepts valid transactions', async () => {
        // configure autoconnection
        mockGetActiveSessions.mockImplementation(() => mockActiveSessions)

        // mock web3 send
        mockWeb3Stub.send.mockImplementation(() => Promise.resolve('0x'))

        let fireTransactionProposalEvent = (
          proposal: SignClientTypes.EventArguments['session_request'],
        ) => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_request') {
            fireTransactionProposalEvent = callback
          }
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockApproveSession).not.toBeCalled()
        expect(mockRejectSession).not.toBeCalled()
        expect(mockRespondSessionRequest).not.toBeCalled()

        act(() => {
          // simulate a valid transaction
          fireTransactionProposalEvent(mockValidTransactionRequest)
        })

        const errorMessageLabel =
          'Transaction rejected: the connected Dapp is not set to the correct chain. Make sure the Dapp only uses Goerli to interact with this Safe.'

        expect(screen.queryByText(errorMessageLabel)).not.toBeInTheDocument()

        // responds to the Dapp with a valid transaction message
        await waitFor(() =>
          expect(mockRespondSessionRequest).toBeCalledWith({
            topic: mockValidTransactionRequest.topic,
            response: {
              id: mockValidTransactionRequest.id,
              jsonrpc: '2.0',
              result: '0x',
            },
          }),
        )

        expect(mockRespondSessionRequest).toBeCalledTimes(1)
      })

      it('rejects transactions from diffetent chains', async () => {
        // configure autoconnection
        mockGetActiveSessions.mockImplementation(() => mockActiveSessions)

        let fireTransactionProposalEvent = (
          proposal: SignClientTypes.EventArguments['session_request'],
        ) => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_request') {
            fireTransactionProposalEvent = callback
          }
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockApproveSession).not.toBeCalled()
        expect(mockRejectSession).not.toBeCalled()
        expect(mockRespondSessionRequest).not.toBeCalled()

        act(() => {
          // simulate an invalid transaction (from different chain Safe chain)
          fireTransactionProposalEvent(mockInvalidChainTransactionRequest)
        })

        const errorMessageLabel =
          'Transaction rejected: the connected Dapp is not set to the correct chain. Make sure the Dapp only uses Goerli to interact with this Safe.'

        // respond with an transaction rejected error
        expect(mockRespondSessionRequest).toBeCalledWith({
          topic: mockInvalidChainTransactionRequest.topic,
          response: {
            id: mockInvalidChainTransactionRequest.id,
            jsonrpc: '2.0',
            error: {
              code: 5100, // unsupported chain error code
              message: errorMessageLabel,
            },
          },
        })

        expect(mockRespondSessionRequest).toBeCalledTimes(1)

        // we show an error label in the IU
        await waitFor(() => expect(screen.getByText(errorMessageLabel)).toBeInTheDocument())
      })

      it('shows an error if user manually rejects a transaction', async () => {
        // configure autoconnection
        mockGetActiveSessions.mockImplementation(() => mockActiveSessions)

        const errorMessageLabel = 'Transaction was rejected'

        // mock web3 send with the user rejection
        mockWeb3Stub.send.mockImplementation(() => Promise.reject({ message: errorMessageLabel }))

        let fireTransactionProposalEvent = (
          proposal: SignClientTypes.EventArguments['session_request'],
        ) => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_request') {
            fireTransactionProposalEvent = callback
          }
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        expect(mockApproveSession).not.toBeCalled()
        expect(mockRejectSession).not.toBeCalled()
        expect(mockRespondSessionRequest).not.toBeCalled()

        act(() => {
          // simulate a valid transaction
          fireTransactionProposalEvent(mockValidTransactionRequest)
        })

        // we show a error label
        await waitFor(() => {
          expect(screen.getByText(errorMessageLabel)).toBeInTheDocument()
        })

        // responds to the Dapp with a valid transaction message
        await waitFor(() =>
          expect(mockRespondSessionRequest).toBeCalledWith({
            topic: mockValidTransactionRequest.topic,
            response: {
              id: mockValidTransactionRequest.id,
              jsonrpc: '2.0',
              error: {
                code: 4001,
                message: errorMessageLabel,
              },
            },
          }),
        )

        expect(mockRespondSessionRequest).toBeCalledTimes(1)
      })
    })

    describe('remove session', () => {
      it('remove session from the Safe App', async () => {
        // configure autoconnection
        mockGetActiveSessions.mockImplementation(() => mockActiveSessions)

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        // we click on disconnect button
        const disconnectButtonNode = screen.getByText('Disconnect')
        expect(disconnectButtonNode).toBeInTheDocument()

        fireEvent.click(disconnectButtonNode)

        await waitFor(() => {
          expect(screen.getByText(HELP_TITLE)).toBeInTheDocument()
          expect(screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)).toBeInTheDocument()

          expect(mockDisconnectSession).toBeCalled()
        })
      })

      it('remove session from the connected DApp', async () => {
        // configure autoconnection
        mockGetActiveSessions.mockImplementation(() => mockActiveSessions)

        // we simulate a remove session event from the DApp
        let fireRemoveSessionEvent = () => {}

        mockWalletconnectEvent.mockImplementation((eventType, callback) => {
          if (eventType === 'session_delete') {
            fireRemoveSessionEvent = callback
          }
        })

        renderWithProviders(<WalletconnectSafeApp />)

        // wait for loader to be removed
        await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

        act(() => {
          // we mannualy fire the event
          fireRemoveSessionEvent()
        })

        await waitFor(() => {
          expect(screen.getByText(HELP_TITLE)).toBeInTheDocument()
          expect(screen.getByPlaceholderText(CONNECTION_INPUT_TEXT)).toBeInTheDocument()
        })
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

    renderWithProviders(<WalletconnectSafeApp />)

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
