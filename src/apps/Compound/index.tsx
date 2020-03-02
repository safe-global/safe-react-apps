import React, { useEffect, useState } from "react";
import Big from "big.js";
import { BigNumberInput } from "big-number-input";
import { BigNumber } from "ethers/utils";
import Web3 from "web3";

import { SelectContainer, DaiInfo, ButtonContainer } from "./components";
import {
  Button,
  WidgetWrapper,
  Select,
  Title,
  Section,
  Text
} from "../../components";
import cERC20Abi from "./abis/CErc20";

import {
  addListeners,
  sendTransactions,
  SafeInfo,
  TransactionUpdate
} from "../safeConnector";

const web3: any = new Web3(
  "https://rinkeby.infura.io/v3/7aacdc1534804ea3b4fd2c7490009ee1"
);

const daiAddress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
const cDaiAddress = "0x6D7F0754FFeb405d23C51CE938289d4835bE3b14";

const blocksPerYear = (365.25 * 24 * 3600) / 15;
const decimals18 = 10 ** 18;

const CompoundWidget = () => {
  const cDai = new web3.eth.Contract(cERC20Abi, cDaiAddress);
  const dai = new web3.eth.Contract(cERC20Abi, daiAddress);

  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [cTokenSupplyAPR, setCTokenSupplyAPR] = useState("0");
  //const [cDaiInteresEarn, setCDaiInteresEarn] = useState("0");
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [cTokenLocked, setCTokenLocked] = useState<number>(0);
  const [cTokenInput, setCTokenInput] = useState<BigNumber | null>(
    new BigNumber(0)
  );

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

  const bNumberToHumanFormat = (value: number) =>
    new Big(value).div(decimals18).toFixed(4);

  const lock = () => {
    if (!cTokenInput) {
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

    setCTokenInput(new BigNumber(0));
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

    setCTokenInput(new BigNumber(0));
  };

  // const getMaxValueInput = () =>
  //   new BigNumber(userOperation === WithdrawOpearion ? cDaiLocked : daiBalance);

  return (
    <WidgetWrapper>
      <Title>Your Compound balance</Title>

      <SelectContainer>
        <Select />
        <Text strong size="lg">
          {bNumberToHumanFormat(cTokenLocked)}
        </Text>
      </SelectContainer>

      <Section>
        <DaiInfo>
          <div>
            <Text>Locked DAI</Text>
            <Text>{bNumberToHumanFormat(tokenBalance)}</Text>
          </div>
          <div>
            <Text>Interest earned</Text>
            <Text>?.?? OMG</Text>
          </div>
          <div>
            <Text>Current interest rate</Text>
            <Text>{cTokenSupplyAPR}% APR</Text>
          </div>
        </DaiInfo>
      </Section>

      <Title>Withdraw or top up your balance</Title>

      <BigNumberInput
        min={new BigNumber(0)}
        /* max={getMaxValueInput()} */
        decimals={18}
        onChange={setCTokenInput}
        value={cTokenInput}
      />

      {/* <TextField /> */}
      <ButtonContainer>
        <Button variant="contained" onClick={lock}>
          Withdraw
        </Button>
        <Button variant="contained" onClick={withdraw}>
          Top up
        </Button>
      </ButtonContainer>
    </WidgetWrapper>
  );
};

export default CompoundWidget;
