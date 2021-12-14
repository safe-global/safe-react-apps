import { useCallback, useMemo, useState } from 'react';
import { Table, Checkbox, TableSortDirection } from '@gnosis.pm/safe-react-components';
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

  return (
    <Table
      headers={HEADERS}
      rows={rows}
      sortedByHeaderId={orderBy}
      sortDirection={order}
      onHeaderClick={handleHeaderClick}
    />
  );
}

export default Balances;
