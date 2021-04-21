import React, { useCallback, useState, useEffect } from 'react';
import { Button, Loader, Title, TextField, Table, Text } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Transaction } from '@gnosis.pm/safe-apps-sdk';
import web3Utils from 'web3-utils';
import { backOff } from 'exponential-backoff';
import erc20 from './abis/erc20';
import { fetchJson, encodeTxData } from './utils';
import FormContainer from './Container';
import Icon from './Icon';
import Flex from './Flex';

interface Asset {
  balance: string;
  fiatBalance: string;
  fiatConversion: string;
  tokenInfo: {
    address: string;
    decimals: number;
    logoUri: string;
    name: string;
    symbol: string;
    type: string;
  };
}

interface Balance {
  fiatTotal: string;
  items: Asset[];
}

const CURRENCY = 'USD';

async function fetchSafeAssets(safeAddress: string, safeNetwork: string): Promise<Balance> {
  const network = safeNetwork.toLowerCase() === 'mainnet' ? 'mainnet' : 'rinkeby';
  const url = `https://safe-client.${network}.gnosis.io/v1/safes/${safeAddress}/balances/${CURRENCY}/?trusted=false&exclude_spam=true`;
  const data = await fetchJson(url);
  return data as Balance;
}

function tokenToTx(recipient: string, item: Asset): Transaction {
  return item.tokenInfo.type === 'ETHER'
    ? {
        // Send ETH directly to the recipient address
        to: web3Utils.toChecksumAddress(recipient),
        value: item.balance,
        data: '0x',
      }
    : {
        // For other token types, generate a contract tx
        to: web3Utils.toChecksumAddress(item.tokenInfo.address),
        value: '0',
        data: encodeTxData(erc20.transfer, recipient, item.balance),
      };
}

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const [submitting, setSubmitting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [toAddress, setToAddress] = useState<string>('');
  const [isFinished, setFinished] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onError = (userMsg: string, err: Error) => {
    setError(`${userMsg}: ${err.message}`);
    console.error(userMsg, err);
  };

  const fetchBalances = useCallback(async (): Promise<void> => {
    // Fetch safe assets
    try {
      const data = await fetchSafeAssets(safe.safeAddress, safe.network);
      setAssets(data.items);
    } catch (err) {
      onError('Failed fetching balances', err);
    }
  }, [safe]);

  const resetMessages = () => {
    setError('');
    setFinished(false);
  };

  const submitTx = useCallback(async () => {
    if (!web3Utils.isAddress(toAddress)) {
      setError('Please enter a valid recipient address');
      return;
    }

    resetMessages();
    setSubmitting(true);

    const txs = assets.map((item) => tokenToTx(toAddress, item));

    let safeTxHash = '';
    try {
      const data = await sdk.txs.send({ txs });
      safeTxHash = data.safeTxHash;
      console.log(safeTxHash);
    } catch (e) {
      onError('Failed sending transactions', e);
    }

    if (!safeTxHash) {
      setSubmitting(false);
      return;
    }

    try {
      await backOff(() => sdk.txs.getBySafeTxHash(safeTxHash));
    } catch (e) {
      // ignore error
    }

    setSubmitting(false);
    setFinished(true);
    setToAddress('');

    setAssets(
      assets.map((item) => ({
        ...item,
        balance: '0',
        fiatBalance: '0',
      })),
    );
  }, [sdk, assets, toAddress]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTx();
  };

  const onCancel = () => {
    resetMessages();
    setSubmitting(false);
  };

  const onToAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setToAddress(e.target.value);
    resetMessages();
  };

  // Fetch balances
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return (
    <FormContainer onSubmit={onSubmit} onReset={onCancel}>
      <Title size="md">Drain Account</Title>

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
                  <Icon src={item.tokenInfo.logoUri} alt="" />
                  {item.tokenInfo.name}
                </Flex>
              ),
            },
            { content: web3Utils.fromWei(item.balance) },
            { content: item.fiatBalance },
          ],
        }))}
      />

      {error && <Text size="lg">{error}</Text>}

      {isFinished && <Text size="lg">The transaction has been created. Refresh the app when it’s executed.</Text>}

      {submitting ? (
        <>
          <Flex centered>
            <Loader size="md" />
          </Flex>
          <Flex centered>
            <Button size="lg" color="secondary" type="reset">
              Cancel
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <TextField onChange={onToAddressChange} value={toAddress} label="Recipient" />

          <Flex centered>
            <Button size="lg" color="primary" variant="contained" type="submit">
              Transfer everything
            </Button>
          </Flex>
        </>
      )}
    </FormContainer>
  );
};

export default App;
