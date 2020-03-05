import React, { useEffect, useState } from "react";
import Big from "big.js";
import { BigNumberInput } from "big-number-input";
import Web3 from "web3";

import { web3Provider, getTokenList, TokenItem } from "./config";
import { SelectContainer, DaiInfo, ButtonContainer } from "./components";
import {
  Button,
  WidgetWrapper,
  Select,
  Title,
  Section,
  Text,
  TextField,
  Loader
} from "../../components";
import cERC20Abi from "./abis/CErc20";
import cWEthAbi from "./abis/CWEth";
import {
  addListeners,
  sendTransactions,
  SafeInfo
  // TransactionUpdate
} from "../safeConnector";

const web3: any = new Web3(web3Provider);

const blocksPerYear = 2102400;

type Operation = "lock" | "withdraw";

const CompoundWidget = () => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [tokenList, setTokenList] = useState<Array<TokenItem>>();

  const [selectedToken, setSelectedToken] = useState<TokenItem>();
  const [cTokenInstance, setCTokenInstance] = useState();
  const [tokenInstance, setTokenInstance] = useState();

  const [cTokenSupplyAPR, setCTokenSupplyAPR] = useState("0");
  //const [cDaiInteresEarn, setCDaiInteresEarn] = useState("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [cTokenLocked, setCTokenLocked] = useState<string>("0");

  const [inputValue, setInputValue] = useState<string>("");
  const [inputError, setInputError] = useState();

  // const onTransactionUpdate = ({ txHash, status }: TransactionUpdate) => {
  //   alert(`txHash: ${txHash}, status: ${status}`);
  // };

  // -- Uncomment for debug purposes with local provider
  useEffect(() => {
    const w: any = window;

    w.web3 = new Web3(w.ethereum);
    w.ethereum.enable();
    w.web3.eth.getAccounts().then((addresses: Array<string>) => {
      setSafeInfo({
        safeAddress: addresses[0],
        network: "rinkeby",
        ethBalance: "0.99"
      });
    });
  }, []);

  useEffect(() => {
    addListeners({ onSafeInfo: setSafeInfo /* , onTransactionUpdate */ });
  }, []);

  useEffect(() => {
    if (!safeInfo) {
      return;
    }

    const tokenListRes = getTokenList(safeInfo.network);

    setTokenList(tokenListRes);

    const findDaiRes = tokenListRes.find(t => t.id === "DAI");
    setSelectedToken(findDaiRes);
    // const daiToken = findDaiRes || {
    //   id: "",
    //   label: "",
    //   iconUrl: "",
    //   decimals: 0,
    //   tokenAddr: "",
    //   cTokenAddr: ""
    // };
  }, [safeInfo]);

  useEffect(() => {
    if (!selectedToken) {
      return;
    }

    setCTokenSupplyAPR("0");
    // setCDaiInteresEarn("0");
    setTokenBalance("0");
    setCTokenLocked("0");
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
      if (
        !safeInfo ||
        !selectedToken ||
        !cTokenInstance ||
        !tokenInstance ||
        selectedToken.cTokenAddr.toLocaleLowerCase() !==
          cTokenInstance._address.toLocaleLowerCase() ||
        selectedToken.tokenAddr.toLocaleLowerCase() !==
          tokenInstance._address.toLocaleLowerCase()
      ) {
        return;
      }

      // supplyRate
      const cTokenSupplyRate = await cTokenInstance.methods
        .supplyRatePerBlock()
        .call();

      // token Balance
      let tokenBalance;
      if (selectedToken.id === "ETH") {
        tokenBalance = new Big(safeInfo.ethBalance).times(10 ** 18).toString();
      } else {
        tokenBalance = await tokenInstance.methods
          .balanceOf(safeInfo.safeAddress)
          .call();
      }

      // token Locked
      const tokenLocked = await cTokenInstance.methods
        .balanceOfUnderlying(safeInfo.safeAddress)
        .call();

      const res = new Big(cTokenSupplyRate)
        .times(blocksPerYear)
        .div(10 ** 18)
        .mul(100)
        .toFixed(2);
      setCTokenSupplyAPR(res);

      setTokenBalance(tokenBalance);

      setCTokenLocked(tokenLocked);
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
      operation === "lock" ? new Big(tokenBalance) : new Big(cTokenLocked);

    if (currentValueBN.gt(comparisonValueBN)) {
      setInputError(`Max value is ${bNumberToHumanFormat(tokenBalance)}`);
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
          data: cTokenInstance.methods.mint().encodeABI()
        }
      ];
    } else {
      txs = [
        {
          to: selectedToken.tokenAddr,
          value: 0,
          data: tokenInstance.methods
            .approve(selectedToken.cTokenAddr, supplyParameter)
            .encodeABI()
        },
        {
          to: selectedToken.cTokenAddr,
          value: 0,
          data: cTokenInstance.methods.mint(supplyParameter).encodeABI()
        }
      ];
    }

    sendTransactions(txs);

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
          .encodeABI()
      }
    ];
    sendTransactions(txs);

    setInputValue("");
  };

  const isButtonDisabled = () => Boolean(!inputValue.length || inputError);

  const onSelectItem = (id: string) => {
    if (!tokenList) {
      return;
    }
    const selectedToken = tokenList.find(t => t.id === id);
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
    return <Loader />;
  }

  return (
    <WidgetWrapper>
      <Title>Your Compound balance</Title>

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
            <Text>Locked {selectedToken.label}</Text>
            <Text>{bNumberToHumanFormat(cTokenLocked)}</Text>
          </div>
          <div>
            <Text>Interest earned</Text>
            <Text>?.?? {selectedToken.label}</Text>
          </div>
          <div>
            <Text>Current interest rate</Text>
            <Text>{cTokenSupplyAPR}% APR</Text>
          </div>
        </DaiInfo>
      </Section>

      <Title>Withdraw or top up your balance</Title>

      <BigNumberInput
        decimals={18}
        onChange={onInputChange}
        value={inputValue}
        renderInput={(props: any) => (
          <TextField label="Amount" errorMsg={inputError} {...props} />
        )}
      />

      <ButtonContainer>
        <Button
          variant="contained"
          onClick={withdraw}
          disabled={isButtonDisabled()}
        >
          Withdraw
        </Button>
        <Button
          variant="contained"
          onClick={lock}
          disabled={isButtonDisabled()}
        >
          Top up
        </Button>
      </ButtonContainer>
    </WidgetWrapper>
  );
};

export default CompoundWidget;
