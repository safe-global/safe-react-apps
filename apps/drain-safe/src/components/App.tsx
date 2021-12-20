import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Title, Text } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import web3Utils from 'web3-utils';
import { BigNumber } from 'bignumber.js';

import useBalances, { BalancesType } from '../hooks/use-balances';
import { tokenToTx } from '../utils/sdk-helpers';
import FormContainer from './FormContainer';
import Flex from './Flex';
import Logo from './Logo';
import Balances from './Balances';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import AddressInput from './AddressInput';
import useWeb3 from '../hooks/useWeb3';

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const { web3 } = useWeb3();
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
  const [gasPrice, setGasPrice] = useState<BigNumber>(new BigNumber(0));
  const [networkPrefix, setNetworkPrefix] = useState<string>('');

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

  const onToAddressChange = useCallback((address: string): void => {
    setToAddress(address);
    resetMessages();
  }, []);

  const handleExcludeChange = (tokenAddress: string, checked: boolean): void => {
    if (checked) {
      setExcludedTokens(excludedTokens.filter((address) => address !== tokenAddress));
    } else {
      setExcludedTokens([...excludedTokens, tokenAddress]);
    }
  };

  const transferStatusText = useMemo(() => {
    if (assets.length === excludedTokens.length) {
      return 'No tokens selected';
    }

    if (excludedTokens.length === 0) {
      return 'Transfer everything';
    }

    const assetsToTransferCount = assets.length - excludedTokens.length;
    return `Transfer ${assetsToTransferCount} asset${assetsToTransferCount > 1 ? 's' : ''}`;
  }, [assets.length, excludedTokens.length]);

  const getAddressFromDomain = useCallback(
    (address: string) => web3?.eth.ens.getAddress(address) || Promise.resolve(address),
    [web3],
  );

  useEffect(() => {
    if (balancesError) {
      onError('Failed fetching balances', balancesError);
    }
  }, [balancesError]);

  useEffect(() => {
    sdk.eth.getGasPrice().then((gasPrice) => {
      setGasPrice(new BigNumber(gasPrice));
    });
  }, [sdk.eth]);

  const ethFiatPrice = Number(assets[0]?.fiatConversion || 0);

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const { shortName } = await sdk.safe.getChainInfo();
        setNetworkPrefix(shortName);
      } catch (e) {
        console.error('Unable to get chain info:', e);
      }
    };

    getChainInfo();
  }, [sdk]);

  return (
    <FormContainer onSubmit={onSubmit} onReset={onCancel}>
      <Flex>
        <Logo />
        <Title size="md">Drain Account</Title>
      </Flex>
      <Balances
        ethFiatPrice={ethFiatPrice}
        gasPrice={gasPrice}
        web3={web3}
        assets={assets}
        exclude={excludedTokens}
        onExcludeChange={handleExcludeChange}
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
      {!submitting && (
        <AddressInput
          id="recipient"
          name="toAddress"
          label="Recipient"
          networkPrefix={networkPrefix}
          showNetworkPrefix={!!networkPrefix}
          onChangeAddress={onToAddressChange}
          hiddenLabel={false}
          address={toAddress}
          getAddressFromDomain={getAddressFromDomain}
        />
      )}

      {submitting ? (
        <CancelButton>Cancel</CancelButton>
      ) : (
        <SubmitButton disabled={assets.length === excludedTokens.length}>{transferStatusText}</SubmitButton>
      )}
    </FormContainer>
  );
};

export default App;
