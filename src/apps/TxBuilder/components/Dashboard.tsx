import {
  Button,
  Text,
  Title,
  TextField,
  GenericModal,
  Select,
  ModalFooterConfirmation,
  ButtonLink,
} from "@gnosis.pm/safe-react-components";
import React, { useState, useCallback } from "react";
import Box from "@material-ui/core/Box";

import { ContractInterface } from "../hooks/useServices/interfaceRepository";
import useServices from "../hooks/useServices";
import { ProposedTransaction } from "./models";
import { useSafe } from "../hooks/useSafe";
import WidgetWrapper from "../../../components/WidgetWrapper";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const StyledSelect = styled(Select)`
  width: 400px;
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`;

const StyledText = styled(Text)`
  margin-bottom: 15px;
`;

const StyledExamples = styled.div`
  button {
    padding: 0;
  }
`;

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
          key={index}
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Button
            size="md"
            variant="outlined"
            iconType="delete"
            color="error"
            onClick={() => deleteTx(index)}
          >
            {""}
          </Button>
          <Text size="lg">{tx.description}</Text>
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
  const [showExamples, setShowExamples] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [contract, setContract] = useState<ContractInterface | undefined>(
    undefined
  );
  const [reviewing, setReviewing] = useState(false);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [inputCache, setInputCache] = useState<string[]>([]);
  const [addTxError, setAddTxError] = useState<string | undefined>();
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const [value, setValue] = useState("");

  const handleAddressOrABI = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<ContractInterface | void> => {
    setContract(undefined);
    setLoadAbiError(false);

    const cleanInput = e.currentTarget?.value?.trim();
    setAddressOrAbi(cleanInput);

    if (!cleanInput.length) {
      return;
    }

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

  const getContractMethod = () => contract?.methods[selectedMethodIndex];

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
        cleanInputs[i] =
          cleanValue.charAt(0) === "["
            ? JSON.parse(cleanValue.replace(/"/g, '"'))
            : cleanValue;
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
        setAddTxError(error.message);
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
    if (!transactions.length) {
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
    setTransactions([]);
    setReviewing(false);
  };

  const handleDismiss = () => {
    setReviewing(false);
  };

  const getInputInterface = (input: any) => {
    // This code renders a helper for the input text.
    // When the parameter is of Tuple type, it renders an array with the parameters types
    // required to form the Tuple, if not, it renders the parameter type directly.
    if (input.type.startsWith("tuple")) {
      return `tuple(${input.components
        .map((c: any) => c.internalType)
        .toString()})${input.type.endsWith("[]") ? "[]" : ""}`;
    } else {
      return input.type;
    }
  };

  return (
    <>
      <WidgetWrapper>
        <StyledTitle size="sm">Multisend transaction builder</StyledTitle>
        <StyledText size="sm">
          This app allows you to build a custom multisend transaction.
          <br />
          Enter a Ethereum contract address or ABI to get started.
        </StyledText>

        {/* TXs MODAL */}
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

        {/* ABI Input */}
        <TextField
          value={addressOrAbi}
          label="Enter Contract Address or ABI"
          onChange={handleAddressOrABI}
        />
        {loadAbiError && (
          <Text color="error" size="lg">
            There was a problem trying to load the ABI
          </Text>
        )}

        {/* ABI Loaded */}
        {contract && (
          <>
            <Title size="xs">Transaction information</Title>

            {!contract?.methods.length && (
              <Text size="lg">
                Contract ABI doesn't have any public methods.
              </Text>
            )}

            {/* Input To (destination) */}
            {(isValueInputVisible() || contract.methods.length > 0) && (
              <>
                <TextField
                  style={{ marginTop: 10 }}
                  value={toAddress}
                  label="To Address"
                  onChange={(e) => setToAddress(e.target.value)}
                />
                <br />
              </>
            )}

            {/* Input ETH value */}
            {isValueInputVisible() && (
              <>
                <TextField
                  style={{ marginTop: 10, marginBottom: 10 }}
                  value={value}
                  label="ETH"
                  onChange={(e) => setValue(e.target.value)}
                />

                <br />
              </>
            )}

            {
              <>
                {contract.methods.length > 0 && (
                  <>
                    <br />
                    <StyledSelect
                      items={contract.methods.map((method, index) => ({
                        id: index.toString(),
                        label: method.name,
                      }))}
                      activeItemId={selectedMethodIndex.toString()}
                      onItemClick={(id: string) => {
                        setAddTxError(undefined);
                        handleMethod(Number(id));
                      }}
                    />
                    <StyledExamples>
                      <ButtonLink
                        color="primary"
                        onClick={() => setShowExamples((prev) => !prev)}
                      >
                        {showExamples ? "Hide Examples" : "Show Examples"}
                      </ButtonLink>

                      {showExamples && (
                        <>
                          <Text size="sm" strong>
                            string {"> "}
                            <Text size="sm" as="span">
                              some value
                            </Text>
                          </Text>
                          <Text size="sm" strong>
                            uint256 {"> "}
                            <Text size="sm" as="span">
                              123
                            </Text>
                          </Text>
                          <Text size="sm" strong>
                            address {"> "}
                            <Text size="sm" as="span">
                              0xDe75665F3BE46D696e5579628fA17b662e6fC04e
                            </Text>
                          </Text>
                          <Text size="sm" strong>
                            array {"> "}
                            <Text size="sm" as="span">
                              [1,2,3]
                            </Text>
                          </Text>
                          <Text size="sm" strong>
                            Tuple(uint256, string) {"> "}
                            <Text size="sm" as="span">
                              [1, "someValue"]
                            </Text>
                          </Text>
                          <Text size="sm" strong>
                            Tuple(uint256, string)[] {"> "}
                            <Text size="sm" as="span">
                              [[1, "someValue"], [2, "someOtherValue"]]
                            </Text>
                          </Text>
                        </>
                      )}
                    </StyledExamples>
                  </>
                )}

                {getContractMethod()?.inputs.map((input, index) => {
                  return (
                    <div key={index}>
                      <TextField
                        style={{ marginTop: 10 }}
                        value={inputCache[index] || ""}
                        label={`${input.name || ""}(${getInputInterface(
                          input
                        )})`}
                        onChange={(e) => {
                          setAddTxError(undefined);
                          handleInput(index, e.target.value);
                        }}
                      />
                      <br />
                    </div>
                  );
                })}

                {addTxError && (
                  <Text size="lg" color="error">
                    {addTxError}
                  </Text>
                )}
              </>
            }
            <br />

            {/* Actions */}
            <ButtonContainer>
              {isValueInputVisible() || contract.methods.length > 0 ? (
                <Button
                  size="md"
                  color="primary"
                  onClick={() => addTransaction()}
                >
                  Add transaction
                </Button>
              ) : (
                <div></div>
              )}

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
            </ButtonContainer>
          </>
        )}
      </WidgetWrapper>
    </>
  );
};

export default Dashboard;
