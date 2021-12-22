import React, { useEffect, useState } from 'react';
import Big from 'big.js';
import { BigNumberInput } from 'big-number-input';
import { Button, Select, Title, Section, Text, TextField, Divider, Loader } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import styled from 'styled-components';
import CompBalance from './components/CompBalance';
import { getTokenList, TokenItem } from './config';
import { WidgetWrapper, SelectContainer, DaiInfo, ButtonContainer } from './components';
import { getTokenInteractions, parseEvents } from './tokensTransfers';
import useComptroller from './hooks/useComptroller';
import useWeb3 from './hooks/useWeb3';
import useCToken from './hooks/useCToken';

type Operation = 'lock' | 'withdraw';

const StyledTitle = styled(Title)`
  margin-top: 0;
`;

const CompoundWidget = () => {
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenList, setTokenList] = useState<Array<TokenItem>>();
  const [selectedToken, setSelectedToken] = useState<TokenItem>();
  const { cTokenInstance, tokenInstance } = useCToken(selectedToken);
  const [interestEarn, setInterestEarn] = useState('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [underlyingBalance, setUnderlyingBalance] = useState<string>('0');
  const [inputValue, setInputValue] = useState<string>('');
  const [inputError, setInputError] = useState<string | undefined>();
  const { web3 } = useWeb3();
  const { sdk: appsSdk, safe: safeInfo, connected } = useSafeAppsSDK();
  const { cTokenSupplyAPY, cDistributionTokenSupplyAPY, compAccrued, claimComp } = useComptroller(
    safeInfo?.safeAddress,
    selectedToken,
  );

  // fetch eth balance
  useEffect(() => {
    const fetchEthBalance = async () => {
      try {
        if (safeInfo.safeAddress) {
          const balance = await web3?.eth.getBalance(safeInfo.safeAddress);

          if (balance) {
            setEthBalance(balance);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEthBalance();
  }, [web3, safeInfo.safeAddress]);

  // load tokens list and initialize with DAI
  useEffect(() => {
    if (!safeInfo) {
      return;
    }

    const tokenListRes = getTokenList(safeInfo.chainId);

    setTokenList(tokenListRes);

    const findDaiRes = tokenListRes.find((t) => t.id === 'DAI');
    setSelectedToken(findDaiRes);
  }, [safeInfo]);

  // on selectedToken
  useEffect(() => {
    if (!selectedToken || !web3) {
      return;
    }

    setInterestEarn('0');
    setTokenBalance('0');
    setUnderlyingBalance('0');
    setInputValue('');
    setInputError(undefined);
  }, [selectedToken, web3]);

  useEffect(() => {
    const getData = async () => {
      if (!safeInfo.safeAddress || !selectedToken || !cTokenInstance || !tokenInstance) {
        return;
      }

      // wait until cToken is correctly updated
      if (selectedToken.cTokenAddr.toLocaleLowerCase() !== cTokenInstance?._address.toLocaleLowerCase()) {
        return;
      }

      // wait until token is correctly updated
      if (selectedToken.tokenAddr.toLocaleLowerCase() !== tokenInstance?._address.toLocaleLowerCase()) {
        return;
      }

      // get token Balance
      let tokenBalance;
      if (selectedToken.id === 'ETH') {
        tokenBalance = ethBalance;
      } else {
        tokenBalance = await tokenInstance.methods.balanceOf(safeInfo.safeAddress).call();
      }

      // get token Locked amount
      const underlyingBalance = await cTokenInstance.methods.balanceOfUnderlying(safeInfo.safeAddress).call();

      // get interest earned
      const tokenEvents = await getTokenInteractions(
        safeInfo.chainId,
        safeInfo.safeAddress,
        selectedToken.tokenAddr,
        selectedToken.cTokenAddr,
      );
      const { deposits, withdrawals } = parseEvents(safeInfo.safeAddress, tokenEvents);
      const earned = new Big(underlyingBalance)
        .div(10 ** selectedToken.decimals)
        .plus(withdrawals)
        .minus(deposits);
      const underlyingEarned = earned.lt('0') ? '0' : earned.toFixed(4);

      // update all the values in a row to avoid UI flickers
      selectedToken.id === 'ETH' ? setInterestEarn('-') : setInterestEarn(underlyingEarned);
      setTokenBalance(tokenBalance);
      setUnderlyingBalance(underlyingBalance);
    };

    getData();
  }, [safeInfo, selectedToken, cTokenInstance, tokenInstance, ethBalance]);

  const bNumberToHumanFormat = (value: string) => {
    if (!selectedToken) {
      return '';
    }
    return new Big(value).div(10 ** selectedToken.decimals).toFixed(4);
  };

  const validateInputValue = (operation: Operation): boolean => {
    setInputError(undefined);

    const currentValueBN = new Big(inputValue);
    const comparisonValueBN = operation === 'lock' ? new Big(tokenBalance) : new Big(underlyingBalance);

    if (currentValueBN.gt(comparisonValueBN)) {
      const value = operation === 'lock' ? tokenBalance : underlyingBalance;
      setInputError(`Max value is ${bNumberToHumanFormat(value)}`);
      return false;
    }

    return true;
  };

  const lock = () => {
    if (!selectedToken || !validateInputValue('lock') || !web3) {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter('uint256', inputValue.toString());

    let txs;

    if (selectedToken.id === 'ETH') {
      txs = [
        {
          to: selectedToken.cTokenAddr,
          value: supplyParameter,
          data: cTokenInstance.methods.mint().encodeABI(),
        },
      ];
    } else {
      txs = [
        {
          to: selectedToken.tokenAddr,
          value: '0',
          data: tokenInstance.methods.approve(selectedToken.cTokenAddr, supplyParameter).encodeABI(),
        },
        {
          to: selectedToken.cTokenAddr,
          value: '0',
          data: cTokenInstance.methods.mint(supplyParameter).encodeABI(),
        },
      ];
    }

    appsSdk.txs.send({ txs });

    setInputValue('');
  };

  const withdraw = () => {
    if (!selectedToken || !validateInputValue('withdraw') || !web3) {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter('uint256', inputValue.toString());
    const txs = [
      {
        to: selectedToken.cTokenAddr,
        value: '0',
        data: cTokenInstance.methods.redeemUnderlying(supplyParameter).encodeABI(),
      },
    ];
    appsSdk.txs.send({ txs });

    setInputValue('');
  };

  const isWithdrawDisabled = () => {
    if (!!inputError || !inputValue) {
      return true;
    }

    const bigInput = new Big(inputValue);

    return bigInput.eq('0') || bigInput.gt(underlyingBalance);
  };

  const isSupplyDisabled = () => {
    if (!!inputError || !inputValue) {
      return true;
    }

    const bigInput = new Big(inputValue);

    return bigInput.eq('0') || bigInput.gt(tokenBalance);
  };

  const onSelectItem = (id: string) => {
    if (!tokenList) {
      return;
    }
    const selectedToken = tokenList.find((t) => t.id === id);
    if (!selectedToken) {
      return;
    }
    setSelectedToken(selectedToken);
  };

  const onInputChange = (value: string) => {
    setInputError(undefined);
    setInputValue(value);
  };

  if (!selectedToken || !connected) {
    return <Loader size="md" />;
  }

  return (
    <WidgetWrapper>
      <StyledTitle size="xs">Your Compound balance</StyledTitle>

      <SelectContainer>
        <Select items={tokenList || []} activeItemId={selectedToken.id} onItemClick={onSelectItem} />
        <Text strong size="lg">
          ~ {bNumberToHumanFormat(tokenBalance)}
        </Text>
      </SelectContainer>

      <Section>
        <DaiInfo>
          <div>
            <Text size="lg">Supplied {selectedToken.label}</Text>
            <Text size="lg">~ {bNumberToHumanFormat(underlyingBalance)}</Text>
          </div>
          <Divider />
          <div>
            <Text size="lg">Interest earned</Text>
            <Text size="lg">
              ~ {interestEarn} {selectedToken.label}
            </Text>
          </div>
          <Divider />
          <div>
            <Text size="lg">Supply APY</Text>
            <Text size="lg">{cTokenSupplyAPY}%</Text>
          </div>
          <Divider />
          <div>
            <Text size="lg">Distribution APY</Text>
            <Text size="lg">{cDistributionTokenSupplyAPY}%</Text>
          </div>
        </DaiInfo>
      </Section>

      <CompBalance balance={compAccrued} onCollect={claimComp} />

      <Title size="xs">Withdraw or Supply balance</Title>

      <BigNumberInput
        decimals={selectedToken.decimals}
        onChange={onInputChange}
        value={inputValue}
        renderInput={(props: any) => <TextField label="Amount" meta={{ error: inputError }} {...props} />}
      />

      <ButtonContainer>
        <Button size="lg" color="secondary" variant="contained" onClick={withdraw} disabled={isWithdrawDisabled()}>
          Withdraw
        </Button>
        <Button size="lg" color="primary" variant="contained" onClick={lock} disabled={isSupplyDisabled()}>
          Supply
        </Button>
      </ButtonContainer>
    </WidgetWrapper>
  );
};

export default CompoundWidget;
