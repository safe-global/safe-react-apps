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

  const [addressOrAbi, setAddressOrAbi] = useState("");
  const [loadAbiError, setLoadAbiError] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [contract, setContract] = useState<ContractInterface | undefined>(
    undefined
  );
  const [reviewing, setReviewing] = useState(false);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [inputCache, setInputCache] = useState<string[]>([]);
  const [addTxError, setAddTxError] = useState(false);
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const [value, setValue] = useState("");

  const handleAddressOrABI = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<ContractInterface | void> => {
    setContract(undefined);
    setLoadAbiError(false);

    const cleanInput = e.currentTarget?.value?.trim();
    setAddressOrAbi(cleanInput);

    if (toAddress.length === 0 && services.web3.utils.isAddress(cleanInput)) {
      setToAddress(cleanInput);
    }

    try {
      const contract = await services.interfaceRepo.loadAbi(cleanInput);
      setContract(contract);
    } catch (e) {
      setLoadAbiError(true);
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

  const getContractMethod = () =>
    contract && contract.methods.length > selectedMethodIndex
      ? contract.methods[selectedMethodIndex]
      : undefined;

  const isValueInputVisible = () =>
    !(!contract?.payableFallback || getContractMethod()?.payable);

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

        if (i > 0) {
          description += ", ";
        }
        const input = method.inputs[i];
        description += (input.name || input.type) + ": " + cleanValue;
      }
      description += ")";

      try {
        data = web3.eth.abi.encodeFunctionCall(method, cleanInputs);
      } catch (error) {
        setAddTxError(true);
        return;
      }
    }

    try {
      const cleanTo = web3.utils.toChecksumAddress(toAddress);
      const cleanValue = value.length > 0 ? web3.utils.toWei(value) : 0;

      if (data.length === 0) {
        data = "0x";
      }

      if (description.length === 0) {
        description = `Transfer ${cleanValue} ETH to ${cleanTo}`;
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

      <TextField
        style={{ marginTop: 10 }}
        value={addressOrAbi}
        label="Enter Contract Address or ABI"
        onChange={handleAddressOrABI}
      />
      {loadAbiError && (
        <Text color="error" size="sm">
          There was a problem trying to load the ABI
        </Text>
      )}

      {contract && (
        <>
          <Title size="xs">Transaction information</Title>

          <TextField
            style={{ marginTop: 10 }}
            value={toAddress}
            label="To Address"
            onChange={(e) => setToAddress(e.target.value)}
          />

          <br />

          {isValueInputVisible() && (
            <>
              <TextField
                value={value}
                label="ETH"
                onChange={(e) => setValue(e.target.value)}
              />
              <br />
            </>
          )}

          {addressOrAbi && (
            <>
              {contract.methods.length === 0 ? (
                <Text size="md">
                  Contract ABI source Contract doesn't have any public methods
                </Text>
              ) : (
                <>
                  <Select
                    style={{ marginTop: 10 }}
                    value={selectedMethodIndex}
                    onChange={(e) => {
                      setAddTxError(false);
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
              {getContractMethod &&
                getContractMethod()?.inputs.map((input, index) => (
                  <TextField
                    key={index}
                    style={{ marginTop: 10 }}
                    value={inputCache[index] || ""}
                    label={`${input.name || ""}(${input.type})`}
                    onChange={(e) => {
                      setAddTxError(false);
                      handleInput(index, e.target.value);
                    }}
                  />
                ))}
              {addTxError && (
                <Text size="sm" color="error">
                  There was an error trying to add the TX.
                </Text>
              )}
            </>
          )}

          <br />

          <Button size="md" color="primary" onClick={() => addTransaction()}>
            Add transaction
          </Button>
        </>
      )}
    </WidgetWrapper>
  );
};

export default Dashboard;
