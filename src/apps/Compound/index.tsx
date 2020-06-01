import React, { useEffect, useState } from "react";
import Big from "big.js";
import { BigNumberInput } from "big-number-input";
import Web3 from "web3";
import { ThemeProvider } from "styled-components";
import {
  Button,
  Select,
  Title,
  Section,
  Text,
  TextField,
  Divider,
  Loader,
} from "@gnosis.pm/safe-react-components";
import initSdk, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import styled from "styled-components";

import WidgetWrapper from "../../components/WidgetWrapper";
import { web3Provider, getTokenList, TokenItem } from "./config";
import { SelectContainer, DaiInfo, ButtonContainer } from "./components";
import { getTokenInteractions, parseEvents } from "./tokensTransfers";
import getTheme from "./customTheme";

import cERC20Abi from "./abis/CErc20";
import cWEthAbi from "./abis/CWEth";

const web3: any = new Web3(web3Provider);
const blocksPerDay = 5760;

type Operation = "lock" | "withdraw";

const StyledTitle = styled(Title)`
  margin-top: 0px;
`;

const CompoundWidget = () => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [tokenList, setTokenList] = useState<Array<TokenItem>>();

  const [selectedToken, setSelectedToken] = useState<TokenItem>();
  const [cTokenInstance, setCTokenInstance] = useState<any>();
  const [tokenInstance, setTokenInstance] = useState<any>();

  const [cTokenSupplyAPY, setCTokenSupplyAPY] = useState("0");
  const [interestEarn, setInterestEarn] = useState("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [underlyingBalance, setUnderlyingBalance] = useState<string>("0");

  const [inputValue, setInputValue] = useState<string>("");
  const [inputError, setInputError] = useState<string | undefined>();

  const [appsSdk] = useState(initSdk());

  //-- for development purposes with local provider
  useEffect(() => {
    if (process.env.REACT_APP_LOCAL_WEB3_PROVIDER) {
      console.warn("COMPOUND APP: you are using a local web3 provider");
      const w: any = window;
      w.web3 = new Web3(w.ethereum);
      w.ethereum.enable();
      w.web3.eth.getAccounts().then((addresses: Array<string>) => {
        setSafeInfo({
          safeAddress: addresses[0],
          network: "rinkeby",
          ethBalance: "0.99",
        });
      });
    }
  }, []);

  // config safe connector
  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
    });

    return () => appsSdk.removeListeners();
  }, [appsSdk]);

  // load tokens list and initialize with DAI
  useEffect(() => {
    if (!safeInfo) {
      return;
    }

    const tokenListRes = getTokenList(safeInfo.network);

    setTokenList(tokenListRes);

    const findDaiRes = tokenListRes.find((t) => t.id === "DAI");
    setSelectedToken(findDaiRes);
  }, [safeInfo]);

  // on selectedToken
  useEffect(() => {
    if (!selectedToken) {
      return;
    }

    setCTokenSupplyAPY("0");
    setInterestEarn("0");
    setTokenBalance("0");
    setUnderlyingBalance("0");
    setInputValue("");
    setInputError(undefined);

    setTokenInstance(new web3.eth.Contract(cERC20Abi, selectedToken.tokenAddr));
    if (selectedToken.id === "ETH") {
      setCTokenInstance(
        new web3.eth.Contract(cWEthAbi, selectedToken.cTokenAddr)
      );
    } else {
      setCTokenInstance(
        new web3.eth.Contract(cERC20Abi, selectedToken.cTokenAddr)
      );
    }
  }, [selectedToken]);

  useEffect(() => {
    const getData = async () => {
      if (!safeInfo || !selectedToken || !cTokenInstance || !tokenInstance) {
        return;
      }

      // wait until cToken is correctly updated
      if (
        selectedToken.cTokenAddr.toLocaleLowerCase() !==
        cTokenInstance?._address.toLocaleLowerCase()
      ) {
        return;
      }

      // wait until token is correctly updated
      if (
        selectedToken.tokenAddr.toLocaleLowerCase() !==
        tokenInstance?._address.toLocaleLowerCase()
      ) {
        return;
      }

      // get supplyRate
      const cTokenSupplyRate = await cTokenInstance.methods
        .supplyRatePerBlock()
        .call();

      // get token Balance
      let tokenBalance;
      if (selectedToken.id === "ETH") {
        tokenBalance = new Big(safeInfo.ethBalance).times(10 ** 18).toString();
      } else {
        tokenBalance = await tokenInstance.methods
          .balanceOf(safeInfo.safeAddress)
          .call();
      }

      // get token Locked amount
      const underlyingBalance = await cTokenInstance.methods
        .balanceOfUnderlying(safeInfo.safeAddress)
        .call();

      // get APR
      const dailyRate = new Big(cTokenSupplyRate)
        .times(blocksPerDay)
        .div(10 ** 18);
      const apy = dailyRate
        .plus(1)
        .pow(365)
        .minus(1)
        .times(100)
        .toFixed(2);

      // get interest earned
      const tokenEvents = await getTokenInteractions(
        safeInfo.network,
        safeInfo.safeAddress,
        selectedToken.tokenAddr,
        selectedToken.cTokenAddr
      );
      const { deposits, withdrawals } = parseEvents(
        safeInfo.safeAddress,
        tokenEvents
      );
      const earned = new Big(underlyingBalance)
        .div(10 ** selectedToken.decimals)
        .plus(withdrawals)
        .minus(deposits);
      const underlyingEarned = earned.lt("0") ? "0" : earned.toFixed(4);

      // update all the values in a row to avoid UI flickers
      selectedToken.id === "ETH"
        ? setInterestEarn("-")
        : setInterestEarn(underlyingEarned);
      setCTokenSupplyAPY(apy.toString());
      setTokenBalance(tokenBalance);
      setUnderlyingBalance(underlyingBalance);
    };

    getData();
  }, [safeInfo, selectedToken, cTokenInstance, tokenInstance]);

  const bNumberToHumanFormat = (value: string) => {
    if (!selectedToken) {
      return "";
    }
    return new Big(value).div(10 ** selectedToken.decimals).toFixed(4);
  };

  const validateInputValue = (operation: Operation): boolean => {
    setInputError(undefined);

    const currentValueBN = new Big(inputValue);
    const comparisonValueBN =
      operation === "lock" ? new Big(tokenBalance) : new Big(underlyingBalance);

    if (currentValueBN.gt(comparisonValueBN)) {
      const value = operation === "lock" ? tokenBalance : underlyingBalance;
      setInputError(`Max value is ${bNumberToHumanFormat(value)}`);
      return false;
    }

    return true;
  };

  const lock = () => {
    if (!selectedToken || !validateInputValue("lock")) {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter(
      "uint256",
      inputValue.toString()
    );

    let txs;

    if (selectedToken.id === "ETH") {
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
          value: 0,
          data: tokenInstance.methods
            .approve(selectedToken.cTokenAddr, supplyParameter)
            .encodeABI(),
        },
        {
          to: selectedToken.cTokenAddr,
          value: 0,
          data: cTokenInstance.methods.mint(supplyParameter).encodeABI(),
        },
      ];
    }

    appsSdk.sendTransactions(txs);

    setInputValue("");
  };

  const withdraw = () => {
    if (!selectedToken || !validateInputValue("withdraw")) {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter(
      "uint256",
      inputValue.toString()
    );
    const txs = [
      {
        to: selectedToken.cTokenAddr,
        value: 0,
        data: cTokenInstance.methods
          .redeemUnderlying(supplyParameter)
          .encodeABI(),
      },
    ];
    appsSdk.sendTransactions(txs);

    setInputValue("");
  };

  const isWithdrawDisabled = () => {
    if (!!inputError || !inputValue) {
      return true;
    }

    const bigInput = new Big(inputValue);

    if (bigInput.eq("0") || bigInput.gt(underlyingBalance)) {
      return true;
    }

    return false;
  };

  const isSupplyDisabled = () => {
    if (!!inputError || !inputValue) {
      return true;
    }

    const bigInput = new Big(inputValue);

    if (bigInput.eq("0") || bigInput.gt(tokenBalance)) {
      return true;
    }

    return false;
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

  if (!selectedToken) {
    return <Loader size="md" />;
  }

  return (
    <ThemeProvider theme={getTheme()}>
      <WidgetWrapper>
        <StyledTitle size="xs">Your Compound balance</StyledTitle>

        <SelectContainer>
          <Select
            items={tokenList || []}
            activeItemId={selectedToken.id}
            onItemClick={onSelectItem}
          />
          <Text strong size="lg">
            ~ {bNumberToHumanFormat(tokenBalance)}
          </Text>
        </SelectContainer>

        <Section>
          <DaiInfo>
            <div>
              <Text size="lg">Supply {selectedToken.label}</Text>
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
              <Text size="lg">Current interest rate</Text>
              <Text size="lg">{cTokenSupplyAPY}% APR</Text>
            </div>
            <Divider />
          </DaiInfo>
        </Section>

        <Title size="xs">Withdraw or Supply balance</Title>

        <BigNumberInput
          decimals={selectedToken.decimals}
          onChange={onInputChange}
          value={inputValue}
          renderInput={(props: any) => (
            <TextField label="Amount" meta={{ error: inputError }} {...props} />
          )}
        />

        <ButtonContainer>
          <Button
            size="lg"
            color="secondary"
            variant="contained"
            onClick={withdraw}
            disabled={isWithdrawDisabled()}
          >
            Withdraw
          </Button>
          <Button
            size="lg"
            color="primary"
            variant="contained"
            onClick={lock}
            disabled={isSupplyDisabled()}
          >
            Supply
          </Button>
        </ButtonContainer>
      </WidgetWrapper>
    </ThemeProvider>
  );
};

export default CompoundWidget;
