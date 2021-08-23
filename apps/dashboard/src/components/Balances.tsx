import { Table } from '@gnosis.pm/safe-react-components';
import { formatTokenValue, formatCurrencyValue } from '../utils/formatters';
import Icon from './Icon';
import Flex from './Flex';

const ethToken = {
  logoUri: './eth.svg',
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
};

const CURRENCY = 'USD';

function Balances({ assets }: { assets: any[] }): JSX.Element {
  return (
    <Table
      headers={[
        { id: 'col1', label: 'Asset' },
        { id: 'col2', label: 'Amount' },
        { id: 'col3', label: `Value, ${CURRENCY}` },
      ]}
      rows={assets.map((item, index: number) => {
        const token = item.tokenInfo || ethToken;

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
