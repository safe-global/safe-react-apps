import { Table, Checkbox } from '@gnosis.pm/safe-react-components';
import { formatTokenValue, formatCurrencyValue } from '../utils/formatters';
import Icon from './Icon';
import { TokenBalance, TokenInfo } from '@gnosis.pm/safe-apps-sdk';
import Flex from './Flex';

const CURRENCY = 'USD';

const ethToken: TokenInfo = {
  logoUri: './eth.svg',
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
  type: 'NATIVE_TOKEN',
  address: '',
};

function Balances({
  assets,
  exclude,
  onExcludeChange,
}: {
  assets: TokenBalance[];
  exclude: string[];
  onExcludeChange: (address: string, checked: boolean) => void;
}): JSX.Element {
  const handleExclusion = (address: string, checked: boolean) => {
    onExcludeChange(address, checked);
  };

  return (
    <Table
      headers={[
        { id: 'col1', label: 'Asset' },
        { id: 'col2', label: 'Amount' },
        { id: 'col3', label: `Value, ${CURRENCY}` },
        { id: 'col4', label: 'Exclude' },
      ]}
      rows={assets.map((item: TokenBalance, index: number) => {
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
      })}
    />
  );
}

export default Balances;
