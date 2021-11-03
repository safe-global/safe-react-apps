import { Table, Checkbox, TableSortDirection } from '@gnosis.pm/safe-react-components';
import { formatTokenValue, formatCurrencyValue } from '../utils/formatters';
import Icon from './Icon';
import { TokenBalance, TokenInfo } from '@gnosis.pm/safe-apps-sdk';
import Flex from './Flex';
import { useCallback, useMemo, useState } from 'react';
import { getComparator } from '../utils/sort-helpers';

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
  { id: 'exclude', label: 'Exclude' },
];

function Balances({
  assets,
  exclude,
  onExcludeChange,
}: {
  assets: TokenBalance[];
  exclude: string[];
  onExcludeChange: (address: string, checked: boolean) => void;
}): JSX.Element {
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [order, setOrder] = useState<TableSortDirection>(TableSortDirection.asc);

  const handleHeaderClick = useCallback(
    (headerId: string) => {
      if (headerId === 'exclude') {
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
    (address: string, checked: boolean) => {
      onExcludeChange(address, checked);
    },
    [onExcludeChange],
  );

  const rows = useMemo(
    () =>
      assets
        .slice()
        .sort(getComparator(order, orderBy))
        .map((item: TokenBalance, index: number) => {
          const token = item.tokenInfo || ethToken;

          return {
            id: `row${index}`,
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
              { content: formatCurrencyValue(item.fiatBalance, CURRENCY) },

              {
                content: (
                  <Checkbox
                    label=""
                    name="exclude"
                    checked={exclude.includes(item.tokenInfo.address)}
                    onChange={(_, checked) => handleExclusion(item.tokenInfo.address, checked)}
                  />
                ),
              },
            ],
          };
        }),
    [assets, exclude, handleExclusion, order, orderBy],
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
