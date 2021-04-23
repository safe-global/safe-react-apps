import React from 'react';
import web3Utils from 'web3-utils';
import { Table } from '@gnosis.pm/safe-react-components';
import { Asset, CURRENCY } from './utils/gateway';
import Icon from './Icon';
import Flex from './Flex';

interface Props {
  assets: Asset[];
}

function Assets(props: Props): JSX.Element {
  const { assets } = props;

  return (
    <Table
      headers={[
        { id: 'col1', label: 'Asset' },
        { id: 'col2', label: 'Amount' },
        { id: 'col3', label: `Value, ${CURRENCY}` },
      ]}
      rows={assets.map((item: Asset, index: number) => ({
        id: `row${index}`,
        cells: [
          {
            content: (
              <Flex>
                {item.tokenInfo.logoUri && <Icon src={item.tokenInfo.logoUri} alt="" />}
                {item.tokenInfo.name}
              </Flex>
            ),
          },
          { content: web3Utils.fromWei(item.balance) },
          { content: item.fiatBalance },
        ],
      }))}
    />
  );
}

export default Assets;
