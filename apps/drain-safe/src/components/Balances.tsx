import { Table } from '@gnosis.pm/safe-react-components';
import { Asset, Token, CURRENCY } from '../utils/api';
import { formatTokenValue, formatCurrencyValue } from '../utils/formatters';
import Icon from './Icon';
import Flex from './Flex';

const ethToken: Token = {
  logoUri: './eth.svg',
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
};

function Balances({ assets }: { assets: Asset[] }): JSX.Element {
  return (
    <Table
      headers={[
        { id: 'col1', label: 'Asset' },
        { id: 'col2', label: 'Amount' },
        { id: 'col3', label: `Value, ${CURRENCY}` },
      ]}
      rows={assets.map((item: Asset, index: number) => {
        const token = item.token || ethToken;

        return {
          id: `row${index}`,
          cells: [
            {
              content: (
                <Flex>
                  <Icon {...token} />
                  {token.name}
                </Flex>
              ),
            },

            { content: formatTokenValue(item.balance, token.decimals) },
            { content: formatCurrencyValue(item.fiatBalance, CURRENCY) },
          ],
        };
      })}
    />
  );
}

export default Balances;
