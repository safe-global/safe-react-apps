import { useEffect, useMemo, useState } from 'react';
import Big from 'big.js';
import { Button, Select, Title, Text, Loader, Tab, ButtonLink } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { getTokenList, TokenItem } from './config';
import { SelectContainer, InfoContainer, ButtonContainer, StyledTitle, StyledTextField } from './styles';
import { getTokenInteractions, parseEvents } from './tokensTransfers';
import useComp from './hooks/useComp';
import useWeb3 from './hooks/useWeb3';
import useCToken from './hooks/useCToken';
import CompBalance from './components/CompBalance';
import InfoRow from './components/InfoRow';
import WidgetWrapper from './components/WidgetWrapper';
import { BigNumberInput } from 'big-number-input';

type Operation = 'lock' | 'withdraw';

const WITHDRAW = 'withdraw';
const SUPPLY = 'supply';
const TABS = [
  { id: SUPPLY, label: 'Supply' },
  { id: WITHDRAW, label: 'Withdraw' },
];

const CompoundWidget = () => {
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenList, setTokenList] = useState<Array<TokenItem>>();
  const [selectedToken, setSelectedToken] = useState<TokenItem>();
  const { cTokenInstance, tokenInstance } = useCToken(selectedToken);
  const [selectedTab, setSelectedTab] = useState(SUPPLY);
  const [interestEarn, setInterestEarn] = useState('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [underlyingBalance, setUnderlyingBalance] = useState<string>('0');
  const [inputValue, setInputValue] = useState<string>('');
  const [inputError, setInputError] = useState<string | undefined>();
  const { web3 } = useWeb3();
  const { sdk: appsSdk, safe: safeInfo, connected } = useSafeAppsSDK();
  const { cTokenSupplyAPY, cDistributionTokenSupplyAPY, claimableComp, claimComp } = useComp(selectedToken);
  const isMainnet = useMemo(() => safeInfo.chainId === 1, [safeInfo.chainId]);

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
      if (selectedToken.cTokenAddr.toLocaleLowerCase() !== cTokenInstance?.['_address'].toLocaleLowerCase()) {
        return;
      }

      // wait until token is correctly updated
      if (selectedToken.tokenAddr.toLocaleLowerCase() !== tokenInstance?.['_address'].toLocaleLowerCase()) {
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

  const lock = async () => {
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
          data: cTokenInstance?.methods.mint().encodeABI(),
        },
      ];
    } else {
      txs = [
        {
          to: selectedToken.tokenAddr,
          value: '0',
          data: tokenInstance?.methods.approve(selectedToken.cTokenAddr, supplyParameter).encodeABI(),
        },
        {
          to: selectedToken.cTokenAddr,
          value: '0',
          data: cTokenInstance?.methods.mint(supplyParameter).encodeABI(),
        },
      ];
    }

    try {
      await appsSdk.txs.send({ txs });
    } catch (error) {
      console.error('Lock: Transaction rejected or failed: ', error);
    }

    setInputValue('');
  };

  const withdraw = async () => {
    if (!selectedToken || !validateInputValue('withdraw') || !web3) {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter('uint256', inputValue.toString());
    const txs = [
      {
        to: selectedToken.cTokenAddr,
        value: '0',
        data: cTokenInstance?.methods.redeemUnderlying(supplyParameter).encodeABI(),
      },
    ];

    try {
      await appsSdk.txs.send({ txs });
    } catch (error) {
      console.error('Withdraw: Transaction rejected or failed: ', error);
    }

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

  const handleTabsChange = (selected: string) => {
    setSelectedTab(selected);
    setInputValue('');
  };

  const handleMaxInputValue = () => setInputValue(selectedTab === SUPPLY ? tokenBalance : underlyingBalance);

  if (!selectedToken || !connected) {
    return <Loader size="md" />;
  }

  return (
    <WidgetWrapper>
      <StyledTitle size="sm">Compound</StyledTitle>

      <SelectContainer>
        <Select items={tokenList || []} activeItemId={selectedToken.id} onItemClick={onSelectItem} />
        <Text strong size="lg">
          ~ {bNumberToHumanFormat(tokenBalance)}
        </Text>
      </SelectContainer>

      <Tab onChange={handleTabsChange} selectedTab={selectedTab} variant="outlined" fullWidth items={TABS} />

      <InfoContainer>
        <InfoRow label={`Supplied ${selectedToken.label}`} data={bNumberToHumanFormat(underlyingBalance)} />
        <InfoRow label="Interest earned" data={`~ ${interestEarn} ${selectedToken.label}`} />
        <InfoRow label="Supply APY" data={cTokenSupplyAPY && `${cTokenSupplyAPY}%`} />
        {isMainnet && (
          <InfoRow label="Distribution APY" data={cDistributionTokenSupplyAPY && `${cDistributionTokenSupplyAPY}%`} />
        )}
      </InfoContainer>

      <BigNumberInput
        decimals={selectedToken.decimals}
        onChange={onInputChange}
        value={inputValue}
        renderInput={(props: any) => (
          <StyledTextField
            label="Amount"
            meta={{ error: inputError }}
            {...props}
            endAdornment={
              <ButtonLink color="primary" onClick={handleMaxInputValue}>
                MAX
              </ButtonLink>
            }
          />
        )}
      />

      <ButtonContainer>
        {selectedTab === WITHDRAW && (
          <Button
            size="lg"
            color="secondary"
            variant="contained"
            onClick={withdraw}
            disabled={isWithdrawDisabled()}
            fullWidth
          >
            {parseFloat(underlyingBalance) > 0 ? 'Withdraw' : 'No balance to withdraw'}
          </Button>
        )}

        {selectedTab === SUPPLY && (
          <Button size="lg" color="primary" variant="contained" onClick={lock} disabled={isSupplyDisabled()} fullWidth>
            {parseFloat(tokenBalance) > 0 ? 'Supply' : 'No balance to supply'}
          </Button>
        )}
      </ButtonContainer>

      {isMainnet && <CompBalance balance={claimableComp} onCollect={claimComp} />}
    </WidgetWrapper>
  );
};

export default CompoundWidget;
