import React, { useState, useEffect } from 'react';
import { Title, TextField, Text } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import web3Utils from 'web3-utils';
import useBalances, { BalancesType } from '../hooks/use-balances';
import { tokenToTx } from '../utils/sdk-helpers';
import FormContainer from './FormContainer';
import Flex from './Flex';
import Logo from './Logo';
import Balances from './Balances';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const {
    assets,
    excludedTokens,
    setExcludedTokens,
    error: balancesError,
  }: BalancesType = useBalances(safe.safeAddress, safe.chainId);
  const [submitting, setSubmitting] = useState(false);
  const [toAddress, setToAddress] = useState<string>('');
  const [isFinished, setFinished] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onError = (userMsg: string, err: Error) => {
    setError(`${userMsg}: ${err.message}`);
    console.error(userMsg, err);
  };

  const resetMessages = () => {
    setError('');
    setFinished(false);
  };

  const sendTxs = async (): Promise<string> => {
    const txs = assets
      .filter((item) => !excludedTokens.includes(item.tokenInfo.address))
      .map((item) => tokenToTx(toAddress, item));
    const data = await sdk.txs.send({ txs });

    return data?.safeTxHash;
  };

  const submitTx = async (): Promise<void> => {
    if (!web3Utils.isAddress(toAddress)) {
      setError('Please enter a valid recipient address');
      return;
    }

    resetMessages();
    setSubmitting(true);

    try {
      await sendTxs();
    } catch (e) {
      setSubmitting(false);
      onError('Failed sending transactions', e as Error);
      return;
    }

    setSubmitting(false);
    setFinished(true);
    setToAddress('');
    setExcludedTokens([]);
  };

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

  const handleExcludeChange = (tokenAddress: string, checked: boolean): void => {
    if (checked) {
      setExcludedTokens([...excludedTokens, tokenAddress]);
    } else {
      setExcludedTokens(excludedTokens.filter((address) => address !== tokenAddress));
    }
  };

  useEffect(() => {
    if (balancesError) {
      onError('Failed fetching balances', balancesError);
    }
  }, [balancesError]);

  return (
    <FormContainer onSubmit={onSubmit} onReset={onCancel}>
      <Flex>
        <Logo />
        <Title size="md">Drain Account</Title>
      </Flex>

      <Balances assets={assets} exclude={excludedTokens} onExcludeChange={handleExcludeChange} />

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

      {!submitting && <TextField onChange={onToAddressChange} value={toAddress} label="Recipient" />}

      {submitting ? <CancelButton /> : <SubmitButton />}
    </FormContainer>
  );
};

export default App;
