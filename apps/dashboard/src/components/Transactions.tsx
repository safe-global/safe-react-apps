import { Table } from '@gnosis.pm/safe-react-components';
import { formatTokenValue } from '../utils/formatters';
import Icon from './Icon';
import Flex from './Flex';
import AddressInfo from './AddressInfo';

function Transactions({ items }: { items: any[] }): JSX.Element {
  return (
    <Table
      headers={[
        { id: 'col1', label: 'Value' },
        { id: 'col2', label: 'Recipient' },
      ]}
      rows={items.map((item, index) => {
        const { txInfo } = item.transaction
        return {
          id: `${item.id}_${index}`,
          cells: [
            {
              content: (
                <Flex>
                  <Icon logoUri={txInfo.transferInfo.logoUri} symbol={txInfo.transferInfo.tokenSymbol} />
                  {formatTokenValue(txInfo.transferInfo.value, txInfo.transferInfo.decimals)}{' '}
                  {txInfo.transferInfo.tokenSymbol}
                </Flex>
              ),
            },

            { content: <AddressInfo hash={txInfo.recipient.value} /> }
          ],
        };
      })}
    />
  );
}

export default Transactions;
