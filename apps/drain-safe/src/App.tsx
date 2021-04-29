import React, { useCallback, useState, useEffect } from 'react';
import { Button, Loader, Title, TextField, Table, Text } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import web3Utils from 'web3-utils';
import { backOff } from 'exponential-backoff';
import { fetchSafeAssets, Asset, CURRENCY } from './utils/gateway';
import { tokenToTx } from './utils/sdk-helpers';
import FormContainer from './Container';
import Icon from './Icon';
import Flex from './Flex';

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
      setAssets(data);
    } catch (err) {
      onError('Failed fetching balances', err);
    }
  }, [safe]);

  const resetMessages = () => {
    setError('');
    setFinished(false);
  };

  const submitTx = useCallback(async (): Promise<void> => {
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
    } catch (e) {
      onError('Failed sending transactions', e);
    }

    if (!safeTxHash) {
      setSubmitting(false);
      return;
    }

    try {
      await backOff(() => sdk.txs.getBySafeTxHash(safeTxHash), {
        startingDelay: 1000,
        delayFirstAttempt: true,
      });
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
                  <Icon asset={item} />
                  {item.token?.name || 'Ether'}
                </Flex>
              ),
            },
            { content: web3Utils.fromWei(item.balance) },
            { content: item.fiatBalance },
          ],
        }))}
      />

      {error && <Text size="lg">{error}</Text>}

      {isFinished && (
        <Text size="lg">
          The transaction has been created.{' '}
          <span role="img" aria-label="success">
            ✅
          </span>
          <br />
          Refresh the app when it’s executed.
        </Text>
      )}

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
