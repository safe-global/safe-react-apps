import React, { useEffect, useState } from "react";
import Big from "big.js";
import { BigNumberInput } from "big-number-input";
import { BigNumber } from "ethers/utils";
import styled from "styled-components";
import Web3 from "web3";

import {
  Button,
  WidgetWrapper,
  RadioButtons,
  TextField,
  Select
} from "../../components";
import cERC20Abi from "./abis/CErc20";
import compoundMark from "./images/compound-mark.svg";
import {
  addListeners,
  sendTransactions,
  SafeInfo,
  TransactionUpdate
} from "../safeConnector";

const StyledHeading = styled.h4`
  font-family: "Averta";
  font-size: 24px;
  font-weight: 900;
  color: #001428;
  text-align: center;
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: center;
`;

const StyledLabel = styled.label`
  font: 19px "Averta";
  color: #001428;
  margin: 15px 0 0 15px;
`;

const DaiSectionInfo = styled.div`
  margin-bottom: 15px;
  border: 1px solid #e8e7e6;
  border-radius: 5px;
  padding: 10px;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-around;
`;

const Value = styled.p`
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StyledTextField = styled(TextField)`
  background-color: #e8e7e6;
  border-radius: 5px;
  padding: 15px;
  width: 378px;
  margin-bottom: 15px;
`;

const StyledBigNumberInput = styled(BigNumberInput)`
  background-color: #e8e7e6;
  border-radius: 5px;
  padding: 15px;
  width: 378px;
  margin-bottom: 15px;
`;

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

  const InvestOpearion = "invest";
  const WithdrawOpearion = "withdraw";

  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [userOperation, setUserOperation] = useState(InvestOpearion);
  const [cDaiSupplyAPR, setCDaiSupplyAPR] = useState("0");
  const [daiBalance, setDaiBalance] = useState<number>(0);
  const [cDaiLocked, setCDaiLocked] = useState<number>(0);
  const [cDaiLockInput, setCDaiLockInput] = useState<BigNumber | null>(
    new BigNumber(0)
  );

  const onTransactionUpdate = ({ txHash, status }: TransactionUpdate) => {
    alert(`txHash: ${txHash}, status: ${status}`);
  };

  useEffect(() => {
    console.log("iframe: add listeners");
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
      setCDaiSupplyAPR(res);

      // dai Balance
      const daiBalance = await dai.methods
        .balanceOf(safeInfo.safeAddress)
        .call();
      setDaiBalance(daiBalance);

      // dai Locked
      const daiLocked = await cDai.methods
        .balanceOfUnderlying(safeInfo.safeAddress)
        .call();
      setCDaiLocked(daiLocked);
    };

    getData();
  });

  const bNumberToHumanFormat = (value: number) =>
    new Big(value).div(decimals18).toFixed(4);

  const lockDai = () => {
    if (!cDaiLockInput) {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter(
      "uint256",
      cDaiLockInput.toString()
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

    setCDaiLockInput(new BigNumber(0));
  };

  const withdrawDai = () => {
    if (!cDaiLockInput || cDaiLockInput.toString() === "0") {
      return;
    }

    const supplyParameter = web3.eth.abi.encodeParameter(
      "uint256",
      cDaiLockInput.toString()
    );
    const txs = [
      {
        to: cDaiAddress,
        value: 0,
        data: cDai.methods.redeemUnderlying(supplyParameter).encodeABI()
      }
    ];
    sendTransactions(txs);

    setCDaiLockInput(new BigNumber(0));
  };

  const onOperationClick = () => {
    userOperation === WithdrawOpearion ? withdrawDai() : lockDai();
  };

  const userOperationOptions = [
    { label: "Invest", value: InvestOpearion },
    { label: "Withdraw", value: WithdrawOpearion }
  ];

  const getMaxValueInput = () =>
    new BigNumber(userOperation === WithdrawOpearion ? cDaiLocked : daiBalance);

  const onRadioChange = (val: string) => {
    setUserOperation(val);
    setCDaiLockInput(new BigNumber(0));
  };

  return (
    <WidgetWrapper
      icon={compoundMark}
      name="Compound"
      description={`Get up to ${cDaiSupplyAPR}% APR on your DAI`}
    >
      <StyledHeading>Your Compound balance</StyledHeading>

      <SelectContainer>
        <Select />
        <StyledLabel>{bNumberToHumanFormat(daiBalance)}</StyledLabel>
      </SelectContainer>

      <DaiSectionInfo>
        <Row>
          <p>Interest earned</p>
          <Value>0.05 OMG</Value>
        </Row>
        <Row>
          <p>Current interest rate</p>
          <Value>7.76% APR</Value>
        </Row>
        {/* <div>Your Invested DAI is: {bNumberToHumanFormat(cDaiLocked)}</div> */}
      </DaiSectionInfo>

      <StyledHeading>Withdraw or top up your balance</StyledHeading>
      {/*  <RadioButtons
            name="userOperation"
            value={userOperation}
            onRadioChange={onRadioChange}
            options={userOperationOptions}
            row
          /> */}

      <StyledBigNumberInput
        min={new BigNumber(0)}
        max={getMaxValueInput()}
        decimals={18}
        onChange={setCDaiLockInput}
        value={cDaiLockInput}
      />
      {/* <Button onClick={() => onOperationClick()}>
          {userOperation === WithdrawOpearion ? "Withdraw" : "Invest"}
        </Button> */}
      <StyledTextField />
      <ButtonContainer>
        <Button variant="contained">Withdraw</Button>
        <Button variant="contained">Top up</Button>
      </ButtonContainer>
    </WidgetWrapper>
  );
};

export default CompoundWidget;
