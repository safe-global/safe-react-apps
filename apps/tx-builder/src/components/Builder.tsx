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
  AddressInput,
} from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { AbiItem, toBN } from 'web3-utils';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import { ProposedTransaction } from '../typings/models';
import { ModalBody } from './ModalBody';
import { Examples } from './Examples';
import AddressContractField from './fields/AddressContractField';

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

const StyledAddressInput = styled(AddressInput)`
  && {
    width: 520px;
    margin-bottom: 10px;

    .MuiFormLabel-root {
      color: #0000008a;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #008c73;
    }
  }
`;

const StyledSelect = styled(Select)`
  margin-top: 10px;
  width: 520px;
`;

const StyledExamples = styled.div`
  margin-bottom: 10px;

  button {
    padding: 0;
  }
`;

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

// Same regex used for web3@1.3.6
const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);

// This function is used to apply some parsing to some value types
const parseInputValue = (input: any, value: string): any => {
  // If there is a match with this regular expression we get an array value like the following
  // ex: ['uint16', 'uint', '16']. If no match, null is returned
  const isNumberInput = paramTypeNumber.test(input.type);
  const isBooleanInput = input.type === 'bool';

  if (value.charAt(0) === '[') {
    return JSON.parse(value.replace(/"/g, '"'));
  }

  if (isBooleanInput) {
    return value.toLowerCase() === 'true';
  }

  if (isNumberInput) {
    // From web3 1.2.5 negative string numbers aren't correctly padded with leading 0's.
    // To fix that we pad the numeric values here as the encode function is expecting a string
    // more info here https://github.com/ChainSafe/web3.js/issues/3772
    const bitWidth = input.type.match(paramTypeNumber)[2];
    return toBN(value).toString(10, bitWidth);
  }

  return value;
};

const isInputValueValid = (val: string) => {
  const value = Number(val);
  if (isNaN(value) || value < 0) {
    return false;
  }

  return true;
};

type Props = {
  contract: ContractInterface | null;
  to: string;
  chainId: number;
  nativeCurrencySymbol: string;
  transactions: ProposedTransaction[];
  onAddTransaction: (transaction: ProposedTransaction) => void;
  onRemoveTransaction: (index: number) => void;
  onSubmitTransactions: () => void;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
};

export const Builder = ({
  contract,
  to,
  chainId,
  nativeCurrencySymbol,
  transactions,
  onAddTransaction,
  onRemoveTransaction,
  onSubmitTransactions,
  networkPrefix,
  getAddressFromDomain,
}: Props): ReactElement | null => {
  const services = useServices(chainId);
  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [addTxError, setAddTxError] = useState<string | undefined>();
  const [valueError, setValueError] = useState<string | undefined>();
  const [inputCache, setInputCache] = useState<string[]>([]);
  const [isValueInputVisible, setIsValueInputVisible] = useState(false);

  const handleMethod = async (methodIndex: number) => {
    if (!contract || contract.methods.length <= methodIndex) return;
    setSelectedMethodIndex(methodIndex);
  };

  const onChangeContractInput = useCallback((index: number, value: string) => {
    setAddTxError(undefined);
    setInputCache((inputCache) => {
      inputCache[index] = value;
      return inputCache.slice();
    });
  }, []);

  const getContractMethod = useCallback(() => contract?.methods[selectedMethodIndex], [contract, selectedMethodIndex]);

  const handleSubmit = () => {
    onSubmitTransactions();
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

    if (!isInputValueValid(valueInput)) {
      setValueError(`${nativeCurrencySymbol} value`);
      return;
    }

    if (contract && contract.methods.length > selectedMethodIndex) {
      const method = contract.methods[selectedMethodIndex];

      if (!['receive', 'fallback'].includes(method.name)) {
        const parsedInputs: any[] = [];
        const inputDescription: string[] = [];

        try {
          method.inputs.forEach((input, index) => {
            const cleanValue = inputCache[index] || '';
            parsedInputs[index] = parseInputValue(input, cleanValue);
            inputDescription[index] = `${input.name || input.type}: ${cleanValue}`;
          });

          description = `${method.name} (${inputDescription.join(', ')})`;

          data = web3.eth.abi.encodeFunctionCall(method as AbiItem, parsedInputs as any[]);
        } catch (error) {
          setAddTxError((error as Error).message);
          return;
        }
      }
    }

    try {
      const cleanTo = web3.utils.toChecksumAddress(toInput);
      const cleanValue = web3.utils.toWei(valueInput || '0');

      if (data.length === 0) {
        data = '0x';
        description = `Transfer ${web3.utils.fromWei(cleanValue.toString())} ${nativeCurrencySymbol} to ${cleanTo}`;
      }

      onAddTransaction({
        description,
        raw: { to: cleanTo, value: cleanValue, data },
      });

      setInputCache([]);
      setSelectedMethodIndex(0);
      setValueInput('');
    } catch (e) {
      setAddTxError('There was an error trying to add the transaction.');
      console.error(e);
    }
  };

  const deleteTransaction = (inputIndex: number) => {
    onRemoveTransaction(inputIndex);
  };

  const isValidAddress = useCallback(
    (address: string | null) => {
      if (!address) {
        return false;
      }
      return services?.web3?.utils.isAddress(address);
    },
    [services.web3],
  );

  const onChangeToAddress = useCallback((address: string) => setToInput(address), []);

  const onValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueError(undefined);
    if (!isInputValueValid(e.target.value)) {
      setValueError(`${nativeCurrencySymbol} value`);
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
  }, [getContractMethod, contract, services, toInput]);

  useEffect(() => {
    if (transactions.length === 0) {
      setReviewing(false);
    }
  }, [transactions]);

  if (!contract && !isValueInputVisible) {
    return null;
  }

  return (
    <>
      <Title size="xs">Transaction information</Title>

      {contract && !contract?.methods.length && <Text size="lg">Contract ABI doesn't have any public methods.</Text>}

      {to.length > 0 && (
        <StyledAddressInput
          id={'to-address-input'}
          name="toAddress"
          label="To Address"
          address={toInput}
          showNetworkPrefix={!!networkPrefix}
          networkPrefix={networkPrefix}
          error={toInput && !isValidAddress(toInput) ? 'Invalid Address' : ''}
          getAddressFromDomain={getAddressFromDomain}
          onChangeAddress={onChangeToAddress}
          hiddenLabel={false}
        />
      )}

      {/* ValueInput */}
      {isValueInputVisible && (
        <StyledTextField
          style={{ marginTop: 10, marginBottom: 10 }}
          value={valueInput}
          label={`${nativeCurrencySymbol} value`}
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
            const isAddressField = input.internalType === 'address' || input.type === 'address';
            return (
              <div key={index} style={{ marginTop: 10 }}>
                {isAddressField ? (
                  <AddressContractField
                    label={`${input.name || ''}(${getInputHelper(input)})`}
                    onChangeContractInput={onChangeContractInput}
                    input={input}
                    index={index}
                    isValidAddress={isValidAddress}
                    inputCache={inputCache}
                    networkPrefix={networkPrefix}
                    getAddressFromDomain={getAddressFromDomain}
                  />
                ) : (
                  <StyledTextField
                    value={inputCache[index] || ''}
                    label={`${input.name || ''}(${getInputHelper(input)})`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeContractInput(index, e.target.value)}
                  />
                )}
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
      {reviewing && transactions.length > 0 && (
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
