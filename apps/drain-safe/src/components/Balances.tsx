import { Table, Checkbox } from '@gnosis.pm/safe-react-components';
import { formatTokenValue, formatCurrencyValue } from '../utils/formatters';
import Icon from './Icon';
import { TokenInfo } from '@gnosis.pm/safe-apps-sdk';
import Flex from './Flex';
import { DrainSafeTokenBalance } from '../hooks/use-balances';

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
  onAssetsChanged,
}: {
  assets: DrainSafeTokenBalance[];
  onAssetsChanged: (assets: DrainSafeTokenBalance[]) => void;
}): JSX.Element {
  const handleExclusion = (index: number, checked: boolean) => {
    const updatedAssets = [...assets];
    updatedAssets[index].spam = checked;
    onAssetsChanged(updatedAssets);
  };

  return (
    <Table
      headers={[
        { id: 'col1', label: 'Asset' },
        { id: 'col2', label: 'Amount' },
        { id: 'col3', label: `Value, ${CURRENCY}` },
        { id: 'col4', label: 'Exclude' },
      ]}
      rows={assets.map((item: DrainSafeTokenBalance, index: number) => {
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
                  checked={!!item.spam}
                  onChange={(_, checked) => handleExclusion(index, checked)}
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
