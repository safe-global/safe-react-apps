import React, { useEffect, useState } from "react";
import Big from "big.js";
import { BigNumberInput } from "big-number-input";
import Web3 from "web3";

import { web3Provider, daiAddress, cDaiAddress, tokenList } from "./config";
import { SelectContainer, DaiInfo, ButtonContainer } from "./components";
import {
  Button,
  WidgetWrapper,
  Select,
  Title,
  Section,
  Text,
  TextField
} from "../../components";
import cERC20Abi from "./abis/CErc20";

import {
  addListeners,
  sendTransactions,
  SafeInfo,
  TransactionUpdate
} from "../safeConnector";

const web3: any = new Web3(web3Provider);

const blocksPerYear = (365.25 * 24 * 3600) / 15;
const decimals18 = 10 ** 18;

const CompoundWidget = () => {
  const cDai = new web3.eth.Contract(cERC20Abi, cDaiAddress);
  const dai = new web3.eth.Contract(cERC20Abi, daiAddress);

  const [selectedToken, setSelectedToken] = useState("DAI");
  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [cTokenSupplyAPR, setCTokenSupplyAPR] = useState("0");
  //const [cDaiInteresEarn, setCDaiInteresEarn] = useState("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [cTokenLocked, setCTokenLocked] = useState<string>("0");
  const [cTokenInput, setCTokenInput] = useState<string>("");
  const [inputError, setInputError] = useState();

  const onTransactionUpdate = ({ txHash, status }: TransactionUpdate) => {
    alert(`txHash: ${txHash}, status: ${status}`);
  };

  useEffect(() => {
    addListeners({ onSafeInfo: setSafeInfo, onTransactionUpdate });
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!safeInfo) {
        return;
      }

      // supplyRate
      const cDaiSupplyRate = await cDai.methods.supplyRatePerBlock().call();
      const res = new Big(cDaiSupplyRate)
        .times(blocksPerYear)
        .div(decimals18)
        .mul(100)
        .toFixed(2);
      setCTokenSupplyAPR(res);

      // dai Balance
      const daiBalance = await dai.methods
        .balanceOf(safeInfo.safeAddress)
        .call();
      setTokenBalance(daiBalance);

      // dai Locked
      const daiLocked = await cDai.methods
        .balanceOfUnderlying(safeInfo.safeAddress)
        .call();
      setCTokenLocked(daiLocked);
    };

    getData();
  });

  const bNumberToHumanFormat = (value: string) =>
    new Big(value).div(decimals18).toFixed(4);

  const lock = () => {
    if (!cTokenInput || cTokenInput.toString() === "0") {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter(
      "uint256",
      cTokenInput.toString()
    );
    const txs = [
      {
        to: daiAddress,
        value: 0,
        data: dai.methods.approve(cDaiAddress, supplyParameter).encodeABI()
      },
      {
        to: cDaiAddress,
        value: 0,
        data: cDai.methods.mint(supplyParameter).encodeABI()
      }
    ];
    sendTransactions(txs);

    setCTokenInput("");
  };

  const withdraw = () => {
    if (!cTokenInput || cTokenInput.toString() === "0") {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter(
      "uint256",
      cTokenInput.toString()
    );
    const txs = [
      {
        to: cDaiAddress,
        value: 0,
        data: cDai.methods.redeemUnderlying(supplyParameter).encodeABI()
      }
    ];
    sendTransactions(txs);

    setCTokenInput("");
  };

  const onInputChange = (value: string) => {
    setCTokenInput(value);
    setInputError(undefined);

    if (!value || !value.length) {
      return;
    }

    const currentValue = new Big(value);
    const maxValue = new Big(tokenBalance);

    if (currentValue.gt(maxValue)) {
      setInputError(`Max value is ${bNumberToHumanFormat(tokenBalance)}`);
    }
  };

  const isButtonDisabled = () => Boolean(!cTokenInput.length || inputError);

  return (
    <WidgetWrapper>
      <Title>Your Compound balance</Title>

      <SelectContainer>
        <Select
          items={tokenList}
          activeItemId={selectedToken}
          onItemClick={setSelectedToken}
        />
        <Text strong size="lg">
          {bNumberToHumanFormat(cTokenLocked)}
        </Text>
      </SelectContainer>

      <Section>
        <DaiInfo>
          <div>
            <Text>Locked {selectedToken}</Text>
            <Text>{bNumberToHumanFormat(tokenBalance)}</Text>
          </div>
          <div>
            <Text>Interest earned</Text>
            <Text>?.?? {selectedToken}</Text>
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
        value={cTokenInput}
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
