import { useMemo, useState, useEffect } from 'react'
import { DataTable } from '@gnosis.pm/safe-react-components'
import { GridColDef, GridRowsProp, GridSelectionModel, GridDensityTypes } from '@mui/x-data-grid'
import { TokenBalance, TokenInfo, TokenType } from '@safe-global/safe-apps-sdk'
import BigNumber from 'bignumber.js'

import { formatTokenValue } from '../utils/formatters'
import Icon from './Icon'
import CurrencyCell from './CurrencyCell'

const CURRENCY = 'USD'

const ethToken: TokenInfo = {
  logoUri: './eth.svg',
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
  type: TokenType['NATIVE_TOKEN'],
  address: '',
}

function Balances({
  assets,
  onSelectionChange,
  gasPrice,
  ethFiatPrice,
}: {
  assets: TokenBalance[]
  ethFiatPrice: number
  onSelectionChange: (addresses: string[]) => void
  gasPrice: BigNumber
}): JSX.Element {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

  useEffect(() => {
    setSelectionModel(assets.map(item => item.tokenInfo.address))
  }, [assets])

  const dataGridColumns: GridColDef[] = [
    {
      field: 'asset',
      headerName: 'Asset',
      flex: 1,
      sortComparator: (v1, v2, param1: any, param2: any) => {
        if (param1.value.name < param2.value.name) {
          return -1
        }

        if (param1.value.name > param2.value.name) {
          return 1
        }

        return 0
      },
      renderCell: (params: any) => {
        const { logoUri, symbol, name } = params.value

        return (
          <>
            <Icon logoUri={logoUri} symbol={symbol} />
            {name}
          </>
        )
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      sortComparator: (v1, v2, param1: any, param2: any) => {
        return param1.value - param2.value
      },
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      sortComparator: (v1, v2, param1: any, param2: any) => {
        return param1.value.fiatBalance - param2.value.fiatBalance
      },
      renderCell: (params: any) => (
        <CurrencyCell
          ethFiatPrice={ethFiatPrice}
          gasPrice={gasPrice}
          item={params.value}
          currency={CURRENCY}
        />
      ),
    },
  ]

  const dataGridRows: GridRowsProp = useMemo(
    () =>
      assets.slice().map((item: TokenBalance) => {
        const token = item.tokenInfo || ethToken

        return {
          id: token.address,
          asset: token,
          amount: formatTokenValue(item.balance, token.decimals),
          value: item,
        }
      }),
    [assets],
  )

  return (
    <DataTable
      sortingOrder={['desc', 'asc']}
      rows={dataGridRows}
      columns={dataGridColumns}
      hideFooter
      disableColumnMenu
      checkboxSelection
      autoHeight
      disableVirtualization /* https://github.com/mui-org/material-ui-x/issues/1519 */
      selectionModel={selectionModel}
      density={GridDensityTypes.Comfortable}
      onSelectionModelChange={(newSelection: GridSelectionModel) => {
        setSelectionModel(newSelection)
        onSelectionChange(newSelection as string[])
      }}
    />
  )
}

export default Balances
