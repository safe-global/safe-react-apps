import {
  Button,
  Text,
  Title,
  TextField,
  GenericModal,
  ModalFooterConfirmation,
} from "@gnosis.pm/safe-react-components";
import React, { useState, useCallback } from "react";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { ContractInterface } from "../hooks/useServices/interfaceRepository";
import useServices from "../hooks/useServices";
import { ProposedTransaction } from "./models";
import { useSafe } from "../hooks/useSafe";
import WidgetWrapper from "../../../components/WidgetWrapper";

const ModalBody = ({
  txs,
  deleteTx,
}: {
  txs: Array<ProposedTransaction>;
  deleteTx: (index: number) => void;
}) => {
  return (
    <>
      {txs.map((tx, index) => (
        <Box
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Button
            size="md"
            variant="outlined"
            color="secondary"
            onClick={() => deleteTx(index)}
          >
            Delete
          </Button>
          <Text size="md">{tx.description}</Text>
        </Box>
      ))}
    </>
  );
};

const Dashboard = () => {
  const services = useServices();
  const safe = useSafe();

  const [addressOrAbi, setAddressOrAbi] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [contract, setContract] = useState<ContractInterface | undefined>(
    undefined
  );

  const [reviewing, setReviewing] = useState<boolean>(false);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState<number>(0);

  const [inputCache, setInputCache] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const [value, setValue] = useState<string>("");

  const handleAddressOrABI = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<ContractInterface | void> => {
    const cleanInput = e.currentTarget?.value?.trim();
    setAddressOrAbi(cleanInput);

    if (toAddress.length === 0 && services.web3.utils.isAddress(cleanInput)) {
      setToAddress(cleanInput);
    }

    try {
      const contract = await services.interfaceRepo.loadAbi(cleanInput);
      setContract(contract);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMethod = useCallback(
    async (methodIndex: number) => {
      if (!contract || contract.methods.length <= methodIndex) return;
      setSelectedMethodIndex(methodIndex);
      console.log(contract.methods[methodIndex]);
    },
    [contract]
  );

  const handleInput = useCallback(
    async (inputIndex: number, input: string) => {
      inputCache[inputIndex] = input;
      setInputCache(inputCache.slice());
    },
    [inputCache]
  );

  const method =
    contract && contract.methods.length > selectedMethodIndex
      ? contract.methods[selectedMethodIndex]
      : undefined;

  const addTransaction = useCallback(async () => {
    let description = "";
    let data = "";
    const web3 = services.web3;
    if (contract && contract.methods.length > selectedMethodIndex) {
      const method = contract.methods[selectedMethodIndex];
      const cleanInputs = [];
      description = method.name + " (";
      for (let i = 0; i < method.inputs.length; i++) {
        const cleanValue = inputCache[i] || "";
        cleanInputs[i] = cleanValue;
        if (i > 0) description += ", ";
        const input = method.inputs[i];
        description += (input.name || input.type) + ": " + cleanValue;
      }
      description += ")";
      data = web3.eth.abi.encodeFunctionCall(method, cleanInputs);
    }
    try {
      const cleanTo = web3.utils.toChecksumAddress(toAddress);
      const cleanValue = value.length > 0 ? web3.utils.toWei(value) : 0;
      if (data.length === 0) data = "0x";
      if (description.length === 0) {
        description = `Transfer ${value} ETH to ${cleanTo}`;
      }
      transactions.push({
        description,
        raw: { to: cleanTo, value: cleanValue, data },
      });
      setInputCache([]);
      setTransactions(transactions);
      setSelectedMethodIndex(0);
      setValue("");
    } catch (e) {
      console.error(e);
    }
  }, [
    services,
    transactions,
    toAddress,
    value,
    contract,
    selectedMethodIndex,
    inputCache,
  ]);

  const deleteTransaction = useCallback(
    async (inputIndex: number) => {
      const newTxs = transactions.slice();
      newTxs.splice(inputIndex, 1);
      setTransactions(newTxs);
    },
    [transactions]
  );

  const sendTransactions = useCallback(async () => {
    if (transactions.length) {
      return;
    }

    try {
      safe.sendTransactions(transactions.map((d) => d.raw));
    } catch (e) {
      console.error(e);
    }
  }, [safe, transactions]);

  const handleSubmit = () => {
    sendTransactions();
    setReviewing(false);
  };

  const handleDismiss = () => {
    setReviewing(false);
  };

  return (
    <WidgetWrapper>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        width="100%"
      >
        <Button
          size="md"
          disabled={!transactions.length}
          variant="contained"
          color="primary"
          onClick={() => setReviewing(true)}
        >
          {`Send Transactions ${
            transactions.length ? `(${transactions.length})` : ""
          }`}
        </Button>
      </Box>

      {reviewing && transactions.length > 0 && (
        <GenericModal
          body={<ModalBody txs={transactions} deleteTx={deleteTransaction} />}
          onClose={handleDismiss}
          title="Send Transactions"
          footer={
            <ModalFooterConfirmation
              handleOk={handleSubmit}
              handleCancel={handleDismiss}
            />
          }
        />
      )}

      <Title size="xs">Optional: Contract ABI source</Title>

      <TextField
        style={{ marginTop: 10 }}
        value={addressOrAbi}
        label="Contract Address or ABI"
        onChange={handleAddressOrABI}
      />

      <Title size="xs">Transaction information</Title>

      <TextField
        style={{ marginTop: 10 }}
        value={toAddress}
        label="To Address"
        onChange={(e) => setToAddress(e.target.value)}
      />

      <br />

      {!(
        (contract && !contract.payableFallback) ||
        (method && !method.payable)
      ) && (
        <TextField
          value={value}
          label="ETH"
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {!addressOrAbi || !contract ? null : (
        <>
          {contract.methods.length === 0 ? (
            <Text size="md">
              Optional: Contract ABI source Contract doesn't have any public
              methods
            </Text>
          ) : (
            <>
              <Select
                style={{ marginTop: 10 }}
                value={selectedMethodIndex}
                onChange={(e) => {
                  handleMethod(e.target.value as number);
                }}
              >
                {contract.methods.map((method, index) => (
                  <MenuItem key={index} value={index}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
              <br />
            </>
          )}
          {method &&
            method.inputs.map((input, index) => (
              <TextField
                key={index}
                style={{ marginTop: 10 }}
                value={inputCache[index] || ""}
                label={`${input.name || ""}(${input.type})`}
                onChange={(e) => handleInput(index, e.target.value)}
              />
            ))}
        </>
      )}

      <br />

      <Button size="md" color="primary" onClick={() => addTransaction()}>
        Add transaction
      </Button>
    </WidgetWrapper>
  );
};

export default Dashboard;
