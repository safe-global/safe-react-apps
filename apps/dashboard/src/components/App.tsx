import React, { useCallback, useEffect, useState } from 'react';
import { Title, Text } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { getSafeInfo, getBalances, getTransactionHistory, GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk';
import { formatCurrencyValue } from '../utils/formatters';
import Flex from './Flex';
import Balances from './Balances';
import Transactions from './Transactions';
import PieChart from './PieChart';
import AddressInfo from './AddressInfo';

const clientGatewayUrl = 'https://safe-client.staging.gnosisdev.com/v1';
const CURRENCY = 'USD'
const MAX_TXNS = 4

const App: React.FC = () => {
  const { safe } = useSafeAppsSDK();
  const [ balance, setBalance ] = useState<GatewayDefinitions["SafeBalanceResponse"]>();
  const [ txns, setTxns ] = useState<GatewayDefinitions["TransactionListItem"][]>();
  const [ safeInfo, setSafeInfo ] = useState<GatewayDefinitions["SafeAppInfo"]>();
  const [ threshold, setThreshold ] = useState<number>(0);

  useEffect(() => {
    if (!safe.chainId || !safe.safeAddress) { return; }

    const chainId = safe.chainId.toString()

    getBalances(clientGatewayUrl, chainId, safe.safeAddress, CURRENCY)
      .then((data) => {
        setBalance(data);
      })

    getTransactionHistory(clientGatewayUrl, chainId, safe.safeAddress)
      .then((data) => {
        setTxns(data.results);
      })

    getSafeInfo(clientGatewayUrl, chainId, safe.safeAddress)
      .then((data) => {
        setSafeInfo(data);
      });
  }, [ safe.chainId, safe.safeAddress ])

  const onThresholdChange = useCallback((e) => {
    setThreshold(Number(e.target.value))
  }, [ setThreshold ])

  return (
    <div style={{ padding: '0 30px 50px' }}>
      <Flex>
        <div style={{ flex: 1 }}>
          <Title size="md">Safe Dashboard</Title>
        </div>

        <label style={{ flex: 1 }}>
          <Flex centered>
            <input type="checkbox" defaultChecked={true} />
            <div style={{ width: '8em' }}>
              <Text size="sm">Hide assets under {formatCurrencyValue(threshold.toString(), CURRENCY)}</Text>
            </div>
            <input type="range" defaultValue={threshold} min={0} max={1000} onChange={onThresholdChange} />
          </Flex>
        </label>

        <div>
          <Text size="md">Address: <b>{safe.safeAddress}</b></Text>
          <Text size="md">Network: <b>{(safe as any).network}</b>, Safe version: <b>{safeInfo?.version || ''}</b></Text>
        </div>
      </Flex>

      {balance && <>
        <Flex>
          <div style={{ width: '40%', height: '300px' }}>
            <PieChart balance={balance} threshold={threshold} />
            <Flex centered><Text size="lg">Total: {formatCurrencyValue(balance.fiatTotal, CURRENCY)}</Text></Flex>
          </div>

          <div style={{ width: '60%', maxHeight: '300px', overflow: 'auto' }}>
            <Balances assets={balance.items.filter((item) => +item.fiatBalance >= threshold)} />
          </div>
        </Flex>
      </>}

      {txns && safeInfo && <div style={{ marginTop: '30px' }}>
        <Flex>
          <div style={{ width: '40%' }}>
            <Title size="md">Owners</Title>
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {safeInfo.owners.map((owner) => (
                <AddressInfo hash={owner.value} key={owner.value} />
              ))}
            </div>

            <Title size="md">Modules</Title>
            <Text size="md">Spending limits: <b>{safeInfo.modules?.length ? 'enabled' : 'not enabled'}</b></Text>
          </div>

          <div style={{ width: '60%' }}>
            <Title size="md">Last transactions</Title>
            <Transactions items={txns.filter((item: any) => item.transaction && item.transaction.txInfo && item.transaction.txInfo.transferInfo).slice(0, MAX_TXNS)} />
          </div>
       </Flex>
      </div>}
    </div>
  );
};

export default App;
