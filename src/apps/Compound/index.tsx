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

import { WidgetWrapper } from "../components";
import { web3Provider, getTokenList, TokenItem } from "./config";
import { SelectContainer, DaiInfo, ButtonContainer } from "./components";
import { getTokenTransferEvents, parseTransferEvents } from "./tokensTransfers";
import theme from "./customTheme";

import cERC20Abi from "./abis/CErc20";
import cWEthAbi from "./abis/CWEth";

const web3: any = new Web3(web3Provider);
const blocksPerDay = 5760;

type Operation = "lock" | "withdraw";

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

  const [appsSdk] = useState(initSdk(process.env.REACT_APP_SAFE_APP_URL || ""));

  // -- Uncomment for debug purposes with local provider
  // useEffect(() => {
  //   const w: any = window;
  //   w.web3 = new Web3(w.ethereum);
  //   w.ethereum.enable();
  //   w.web3.eth.getAccounts().then((addresses: Array<string>) => {
  //     setSafeInfo({
  //       safeAddress: addresses[0],
  //       network: "rinkeby",
  //       ethBalance: "0.99"
  //     });
  //   });
  // }, []);

  // config safe connector
  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo /* , onTransactionUpdate */,
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
      const tokenTransferEvents = await getTokenTransferEvents(
        safeInfo.network,
        safeInfo.safeAddress,
        selectedToken.tokenAddr,
        selectedToken.cTokenAddr
      );
      const { deposits, withdrawals } = parseTransferEvents(
        safeInfo.safeAddress,
        tokenTransferEvents
      );
      const underlyingEarned = new Big(underlyingBalance)
        .div(10 ** selectedToken.decimals)
        .plus(withdrawals)
        .minus(deposits)
        .toFixed(4);

      // update all the values in a row to avoid UI flickers
      selectedToken.id === "ETH"
        ? setInterestEarn("TBD")
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

  const isButtonDisabled = () => {
    return !!(!inputValue.length || inputValue === "0" || inputError);
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
    <ThemeProvider theme={theme}>
      <WidgetWrapper>
        <Title size="xs">Your Compound balance</Title>

        <SelectContainer>
          <Select
            items={tokenList || []}
            activeItemId={selectedToken.id}
            onItemClick={onSelectItem}
          />
          <Text strong size="lg">
            {bNumberToHumanFormat(tokenBalance)}
          </Text>
        </SelectContainer>

        <Section>
          <DaiInfo>
            <div>
              <Text size="lg">Locked {selectedToken.label}</Text>
              <Text size="lg">{bNumberToHumanFormat(underlyingBalance)}</Text>
            </div>
            <Divider />
            <div>
              <Text size="lg">Interest earned</Text>
              <Text size="lg">
                {interestEarn} {selectedToken.label}
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

        <Title size="xs">Withdraw or top up balance</Title>

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
            disabled={isButtonDisabled()}
          >
            Withdraw
          </Button>
          <Button
            size="lg"
            color="primary"
            variant="contained"
            onClick={lock}
            disabled={isButtonDisabled()}
          >
            Top up
          </Button>
        </ButtonContainer>
      </WidgetWrapper>
    </ThemeProvider>
  );
};

export default CompoundWidget;
