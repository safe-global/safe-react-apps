import { useCallback, useMemo, useState } from 'react';
import { Table, Checkbox, TableSortDirection, DataTable } from '@gnosis.pm/safe-react-components';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { TokenBalance, TokenInfo } from '@gnosis.pm/safe-apps-sdk';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { formatTokenValue } from '../utils/formatters';
import Icon from './Icon';
import Flex from './Flex';
import { getComparator } from '../utils/sort-helpers';
import CurrencyCell from './CurrencyCell';

const CURRENCY = 'USD';

const ethToken: TokenInfo = {
  logoUri: './eth.svg',
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
  type: 'NATIVE_TOKEN',
  address: '',
};

const HEADERS = [
  { id: 'tokenInfo.name', label: 'Asset' },
  { id: 'balance', label: 'Amount' },
  { id: 'fiatBalance', label: `Value, ${CURRENCY}` },
  { id: 'transfer', label: 'Transfer', hideSortIcon: true },
];

function Balances({
  assets,
  exclude,
  onExcludeChange,
  gasPrice,
  ethFiatPrice,
  web3,
}: {
  assets: TokenBalance[];
  exclude: string[];
  ethFiatPrice: number;
  web3: Web3 | undefined;
  onExcludeChange: (address: string, checked: boolean) => void;
  gasPrice: BigNumber;
}): JSX.Element {
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [order, setOrder] = useState<TableSortDirection>(TableSortDirection.asc);

  const handleHeaderClick = useCallback(
    (headerId: string) => {
      if (headerId === 'transfer') {
        return;
      }

      const newDirection =
        orderBy === headerId && order === TableSortDirection.asc ? TableSortDirection.desc : TableSortDirection.asc;

      setOrder(newDirection);
      setOrderBy(headerId);
    },
    [order, orderBy],
  );

  const handleExclusion = useCallback(
    (rowId: string) => {
      const isRowChecked = exclude.includes(rowId);
      onExcludeChange(rowId, isRowChecked);
    },
    [onExcludeChange, exclude],
  );

  const rows = useMemo(
    () =>
      assets
        .slice()
        .sort(getComparator(order, orderBy))
        .map((item: TokenBalance) => {
          const token = item.tokenInfo || ethToken;

          return {
            id: item.tokenInfo.address,
            cells: [
              {
                content: (
                  <Flex>
                    <Icon logoUri={token.logoUri} symbol={token.symbol} />
                    {token.name}
                  </Flex>
                ),
              },

              { content: formatTokenValue(item.balance, token.decimals) },
              {
                content: (
                  <CurrencyCell
                    web3={web3}
                    ethFiatPrice={ethFiatPrice}
                    gasPrice={gasPrice}
                    item={item}
                    currency={CURRENCY}
                  />
                ),
              },

              {
                content: (
                  <Checkbox
                    label=""
                    name="transfer"
                    checked={!exclude.includes(item.tokenInfo.address)}
                    onChange={() => handleExclusion(item.tokenInfo.address)}
                  />
                ),
              },
            ],
          };
        }),
    [assets, exclude, handleExclusion, order, orderBy, ethFiatPrice, gasPrice, web3],
  );

  const dataGridColumns: GridColDef[] = [
    {
      field: 'asset',
      headerName: 'Asset',
      flex: 1,
      sortComparator: (val1, val2, api1: any, api2: any) => {
        if (api1.value.name < api2.value.name) {
          return -1;
        }

        if (api1.value.name > api2.value.name) {
          return 1;
        }

        return 0;
      },
      renderCell: (params: any) => {
        const { logoUri, symbol, name } = params.value;

        return (
          <>
            <Icon logoUri={logoUri} symbol={symbol} />
            {name}
          </>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      sortComparator: (val1, val2, api1: any, api2: any) => {
        return api1.value - api2.value;
      },
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      sortComparator: (val1, val2, api1: any, api2: any) => {
        return api1.value.fiatBalance - api2.value.fiatBalance;
      },
      renderCell: (params: any) => (
        <CurrencyCell
          web3={web3}
          ethFiatPrice={ethFiatPrice}
          gasPrice={gasPrice}
          item={params.value}
          currency={CURRENCY}
        />
      ),
    },
  ];

  const dataGridRows: GridRowsProp = useMemo(
    () =>
      assets.slice().map((item: TokenBalance) => {
        const token = item.tokenInfo || ethToken;

        return {
          id: token.address,
          asset: token,
          amount: formatTokenValue(item.balance, token.decimals),
          value: item,
        };
      }),
    [assets],
  );

  return (
    <>
      <Table
        headers={HEADERS}
        rows={rows}
        sortedByHeaderId={orderBy}
        sortDirection={order}
        onHeaderClick={handleHeaderClick}
      />
      <DataTable
        sortingOrder={['desc', 'asc']}
        headerHeight={70}
        rows={dataGridRows}
        columns={dataGridColumns}
        hideFooter
        disableColumnMenu
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        onSelectionModelChange={(newSelectionModel) => {
          console.log(newSelectionModel);
        }}
      />
    </>
  );
}

export default Balances;
