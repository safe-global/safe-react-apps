import { screen, waitFor, fireEvent } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { mockTxsRequest, mockInitialBalances, renderWithProviders } from '../utils/test-helpers'
import App from '../components/App'

jest.mock('@safe-global/safe-apps-react-sdk', () => {
  const originalModule = jest.requireActual('@safe-global/safe-apps-react-sdk')
  const sdk = {
    sdk: {
      txs: { send: jest.fn().mockResolvedValue({ safeTxHash: 'safeTxHash' }) },
      safe: {
        experimental_getBalances: () =>
          Promise.resolve({
            items: mockInitialBalances,
          }),
        getChainInfo: () =>
          Promise.resolve({
            chainId: 4,
            chainName: 'RINKEBY',
            nativeCurrency: {
              address: '0x0000000000000000000000000000000000000000',
              decimals: 18,
              logoUri: '/app/static/media/token_eth.bc98bd46.svg',
              name: 'Ether',
              symbol: 'ETH',
            },
            shortName: 'rin',
          }),
      },
      eth: {
        getGasPrice: () => Promise.resolve(0x3b9aca0b),
        getEstimateGas: () => Promise.resolve(21000),
      },
    },
    safe: {
      safeAddress: '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
      chainId: 'chainId',
    },
  }

  return {
    ...originalModule,
    useSafeAppsSDK: () => sdk,
  }
})

describe('<App />', () => {
  it('should render the tokens in the safe balance', async () => {
    renderWithProviders(<App />)

    expect(await screen.findByText(/ether/i)).toBeInTheDocument()
    expect(await screen.findByText(/0.949938510499549077/)).toBeInTheDocument()
  })

  it('should drain the safe when submit button is clicked', async () => {
    renderWithProviders(<App />)
    const { sdk } = useSafeAppsSDK()

    await screen.findByText(/chainlink token/i)
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' },
    })
    fireEvent.click(screen.getByText(/transfer everything/i))
    await waitFor(() => expect(sdk.txs.send).toHaveBeenCalledWith(mockTxsRequest))
  })

  it('should drain the safe when submit button is clicked removing the tokens excluded by the user', async () => {
    renderWithProviders(<App />)
    const { sdk } = useSafeAppsSDK()

    await screen.findByText(/chainlink token/i)
    const checkboxes = await screen.findAllByRole('checkbox')

    fireEvent.click(checkboxes[2])
    fireEvent.click(checkboxes[4])
    fireEvent.click(checkboxes[5])
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96' },
    })
    fireEvent.click(screen.getByText(/transfer 2 assets/i))

    await waitFor(() =>
      expect(sdk.txs.send).toHaveBeenCalledWith({
        txs: [mockTxsRequest.txs[0], mockTxsRequest.txs[2]],
      }),
    )
  })

  it('should show an error if no recipient address is entered', async () => {
    renderWithProviders(<App />)

    await screen.findByText(/chainLink token/i)
    fireEvent.click(screen.getByText(/transfer everything/i))

    expect(await screen.findByText(/please enter a valid recipient address/i)).toBeInTheDocument()
  })

  it('should allow to order token by string prop', async () => {
    renderWithProviders(<App />)

    await screen.findByText(/chainlink token/i)
    const assetColumnHeaderElement = screen.getByText(/asset/i)
    fireEvent.click(assetColumnHeaderElement)

    await waitFor(() => {
      const tableRows = document.querySelectorAll('.MuiDataGrid-row')
      expect(within(tableRows[4]).getByText(/chainlink token/i)).toBeDefined()
      expect(within(tableRows[0]).getByText(/uniswap/i)).toBeDefined()
    })

    fireEvent.click(assetColumnHeaderElement)

    await waitFor(() => {
      const tableRows = document.querySelectorAll('.MuiDataGrid-row')
      expect(within(tableRows[0]).getByText(/chainlink token/i)).toBeDefined()
      expect(within(tableRows[4]).getByText(/uniswap/i)).toBeDefined()
    })
  })

  it('should allow to order token by numeric prop', async () => {
    renderWithProviders(<App />)

    await screen.findByText(/chainLink token/i)
    const amountColumnHeaderElement = screen.getByText(/amount/i)
    fireEvent.click(amountColumnHeaderElement)

    await waitFor(() => {
      const tableRows = document.querySelectorAll('.MuiDataGrid-row')
      expect(within(tableRows[0]).getByText(/dai/i)).toBeDefined()
      expect(within(tableRows[4]).getByText(/maker/i)).toBeDefined()
    })

    fireEvent.click(amountColumnHeaderElement)

    await waitFor(() => {
      const tableRows = document.querySelectorAll('.MuiDataGrid-row')
      expect(within(tableRows[4]).getByText(/dai/i)).toBeDefined()
      expect(within(tableRows[0]).getByText(/maker/i)).toBeDefined()
    })
  })

  it('Shows a Warning icon when token transfer cost is higher than its current market value ', async () => {
    renderWithProviders(<App />)

    await screen.findByText(/maker/i)

    const warningTooltip =
      /Beware that the cost of this token transfer could be higher than its current market value \(Estimated transfer cost: /i

    await waitFor(() => {
      const tableRows = document.querySelectorAll('.MuiDataGrid-row')

      // warning only should be present in Maker (MKR) row
      const makerRow = tableRows[3]
      expect(within(makerRow).getByText(/maker/i)).toBeDefined()
      expect(within(makerRow).queryByTitle(warningTooltip)).toBeInTheDocument()

      // warning should NOT be present in other rows
      expect(within(tableRows[0]).queryByTitle(warningTooltip)).not.toBeInTheDocument()
      expect(within(tableRows[1]).queryByTitle(warningTooltip)).not.toBeInTheDocument()
      expect(within(tableRows[2]).queryByTitle(warningTooltip)).not.toBeInTheDocument()
    })
  })

  it('Filter native token without value', async () => {
    let balances = mockInitialBalances
    balances[0].fiatBalance = '0.00000'
    const { sdk } = useSafeAppsSDK()
    sdk.safe.experimental_getBalances = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        items: balances,
      }),
    )

    renderWithProviders(<App />)

    await screen.findByText(/maker/i)

    expect(document.querySelectorAll('.MuiDataGrid-row').length).toEqual(4)
  })
})
