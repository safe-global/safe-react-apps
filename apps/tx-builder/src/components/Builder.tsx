import React, { useState, useEffect, ReactElement, useCallback } from 'react';
import {
  Button,
  Text,
  Title,
  TextField,
  GenericModal,
  Select,
  ModalFooterConfirmation,
  ButtonLink,
} from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import styled from 'styled-components';
import { AbiItem } from 'web3-utils';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import { ProposedTransaction } from '../typings/models';
import { ModalBody } from './ModalBody';
import { Examples } from './Examples';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const StyledTextField = styled(TextField)`
  && {
    width: 520px;
    margin-bottom: 10px;
  }
`;

const StyledSelect = styled(Select)`
  width: 520px;
`;

const StyledExamples = styled.div`
  button {
    padding: 0;
  }
`;

type Props = {
  contract: ContractInterface | undefined;
  to: string | null;
};

const getInputHelper = (input: any) => {
  // This code renders a helper for the input text.
  if (input.type.startsWith('tuple')) {
    return `tuple(${input.components.map((c: any) => c.internalType).toString()})${
      input.type.endsWith('[]') ? '[]' : ''
    }`;
  } else {
    return input.type;
  }
};

export const Builder = ({ contract, to }: Props): ReactElement | null => {
  const { sdk, safe } = useSafeAppsSDK();
  const services = useServices(safe.network);

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [addTxError, setAddTxError] = useState<string | undefined>();
  const [valueError, setValueError] = useState<string | undefined>();
  const [inputCache, setInputCache] = useState<string[]>([]);
  const [isValueInputVisible, setIsValueInputVisible] = useState(false);

  const handleMethod = useCallback(
    async (methodIndex: number) => {
      if (!contract || contract.methods.length <= methodIndex) return;
      setSelectedMethodIndex(methodIndex);
    },
    [contract],
  );

  const handleInput = useCallback(
    async (inputIndex: number, input: string) => {
      inputCache[inputIndex] = input;
      setInputCache(inputCache.slice());
    },
    [inputCache],
  );

  const getContractMethod = useCallback(() => contract?.methods[selectedMethodIndex], [contract, selectedMethodIndex]);

  const handleSubmit = () => {
    sendTransactions();
    setTransactions([]);
    setReviewing(false);
  };

  const handleDismiss = () => {
    setReviewing(false);
  };

  const addTransaction = async () => {
    let description = '';
    let data = '';
    const web3 = services.web3;

    if (!web3) {
      return;
    }

    if (contract && contract.methods.length > selectedMethodIndex) {
      const method = contract.methods[selectedMethodIndex];

      if (!['receive', 'fallback'].includes(method.name)) {
        const cleanInputs = [];
        description = method.name + ' (';
        for (let i = 0; i < method.inputs.length; i++) {
          const cleanValue = inputCache[i] || '';
          cleanInputs[i] = cleanValue.charAt(0) === '[' ? JSON.parse(cleanValue.replace(/"/g, '"')) : cleanValue;
          if (i > 0) {
            description += ', ';
          }
          const input = method.inputs[i];
          description += (input.name || input.type) + ': ' + cleanValue;
        }
        description += ')';

        try {
          data = web3.eth.abi.encodeFunctionCall(method as AbiItem, cleanInputs);
        } catch (error) {
          setAddTxError(error.message);
          return;
        }
      }
    }

    try {
      const cleanTo = web3.utils.toChecksumAddress(toInput);
      const cleanValue = web3.utils.toWei(valueInput || '0');

      if (data.length === 0) {
        data = '0x';
        description = `Transfer ${web3.utils.fromWei(cleanValue.toString())} ETH to ${cleanTo}`;
      }

      transactions.push({
        description,
        raw: { to: cleanTo, value: cleanValue, data },
      });

      setInputCache([]);
      setTransactions(transactions);
      setSelectedMethodIndex(0);
      setValueInput('');
    } catch (e) {
      setAddTxError('There was an error trying to add the transaction.');
      console.error(e);
    }
  };

  const deleteTransaction = async (inputIndex: number) => {
    const newTxs = transactions.slice();
    newTxs.splice(inputIndex, 1);
    setTransactions(newTxs);
  };

  const isValidAddress = useCallback(
    (address: string | null) => {
      if (!address) {
        return false;
      }
      return services?.web3?.utils.isAddress(address);
    },
    [services],
  );

  const sendTransactions = useCallback(async () => {
    if (!transactions.length) {
      return;
    }

    sdk.txs.send({ txs: transactions.map((d) => d.raw) }).catch(console.error);
  }, [sdk, transactions]);

  const onValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueError(undefined);
    const value = Number(e.target.value);
    if (isNaN(value) || value < 0) {
      setValueError('ETH value');
    }
    setValueInput(e.target.value);
  };

  // Set toInput when to changes
  useEffect(() => {
    const value = isValidAddress(to) ? (to as string) : '';
    setToInput(value);
  }, [to, isValidAddress]);

  // set when inputValue is visible
  useEffect(() => {
    const isVisible = async () => {
      if (contract) {
        const method = getContractMethod();
        setIsValueInputVisible(method?.payable || false);
      } else {
        setIsValueInputVisible(true);
      }
    };

    isVisible();
  }, [isValidAddress, getContractMethod, contract, services, toInput]);

  if (!contract && !isValueInputVisible) {
    return null;
  }

  return (
    <>
      <Title size="xs">Transaction information</Title>

      {contract && !contract?.methods.length && <Text size="lg">Contract ABI doesn't have any public methods.</Text>}

      {/* toInput */}
      {!isValidAddress(to) && (
        <StyledTextField
          style={{ marginTop: 10 }}
          value={toInput}
          label="To Address"
          onChange={(e) => setToInput(e.target.value)}
        />
      )}

      {/* ValueInput */}
      {isValueInputVisible && (
        <StyledTextField
          style={{ marginTop: 10, marginBottom: 10 }}
          value={valueInput}
          label="Eth value"
          meta={{ error: valueError ?? undefined }}
          onChange={onValueInputChange}
        />
      )}

      {/* Contract Inputs */}
      {contract?.methods.length && (
        <>
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
            <ButtonLink color="primary" onClick={() => setShowExamples((prev) => !prev)}>
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </ButtonLink>

            {showExamples && <Examples />}
          </StyledExamples>

          {getContractMethod()?.inputs.map((input, index) => {
            return (
              <div key={index}>
                <StyledTextField
                  style={{ marginTop: 10 }}
                  value={inputCache[index] || ''}
                  label={`${input.name || ''}(${getInputHelper(input)})`}
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
      )}

      {/* Actions */}
      <ButtonContainer>
        <Button
          size="md"
          color="primary"
          disabled={!isValidAddress(toInput) && !contract?.methods.length}
          onClick={() => addTransaction()}
        >
          Add transaction
        </Button>

        <Button
          size="md"
          disabled={!transactions.length}
          variant="contained"
          color="primary"
          onClick={() => setReviewing(true)}
        >
          {`Send Transactions ${transactions.length ? `(${transactions.length})` : ''}`}
        </Button>
      </ButtonContainer>

      {/* TXs MODAL */}
      {reviewing && transactions.length && (
        <GenericModal
          body={<ModalBody txs={transactions} deleteTx={deleteTransaction} />}
          onClose={handleDismiss}
          title="Send Transactions"
          footer={<ModalFooterConfirmation handleOk={handleSubmit} handleCancel={handleDismiss} />}
        />
      )}
    </>
  );
};
