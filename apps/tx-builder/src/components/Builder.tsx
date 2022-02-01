import React, { useState, useEffect, ReactElement, useCallback, ChangeEvent } from 'react';
import {
  Button,
  Text,
  Title,
  TextFieldInput,
  GenericModal,
  Select,
  ModalFooterConfirmation,
  ButtonLink,
  AddressInput,
  Switch,
} from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { AbiItem, isHexStrict, toChecksumAddress, toWei, fromWei } from 'web3-utils';
import abiCoder, { AbiCoder } from 'web3-eth-abi';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import { ProposedTransaction } from '../typings/models';
import { ModalBody } from './ModalBody';
import { Examples } from './Examples';
import { parseInputValue, getInputHelper, isInputValueValid, getCustomDataError, isValidAddress } from '../utils';
import { TextFieldInputProps } from '@gnosis.pm/safe-react-components/dist/inputs/TextFieldInput';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const StyledTextField = styled(TextFieldInput)`
  && {
    width: 520px;
    margin-bottom: 10px;

    .MuiFormLabel-root {
      color: #0000008a;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #008c73;
    }

    textarea {
      &.MuiInputBase-input {
        padding: 0;
      }
    }
  }
`;

const StyledAddressInput = styled(AddressInput)`
  && {
    width: 520px;
    margin-bottom: 1px;

    .MuiFormLabel-root {
      color: #0000008a;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #008c73;
    }
  }
`;

const StyledTextAreaField = (props: TextFieldInputProps) => {
  return <StyledTextField {...props} multiline rows={4} />;
};

const StyledSelect = styled(Select)`
  margin-top: 10px;
  width: 520px;
`;

const StyledExamples = styled.div`
  margin: 5px 0 10px 0;

  button {
    padding: 0;
  }
`;

const BOOLEAN_ITEMS = [
  { id: 'true', label: 'True' },
  { id: 'false', label: 'False' },
];

type Props = {
  contract: ContractInterface | null;
  to: string;
  chainId: string | undefined;
  nativeCurrencySymbol: string | undefined;
  transactions: ProposedTransaction[];
  onAddTransaction: (transaction: ProposedTransaction) => void;
  onRemoveTransaction: (index: number) => void;
  onSubmitTransactions: () => void;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
};

// TODO: Remove this file
export const Builder = ({
  contract,
  to,
  nativeCurrencySymbol,
  transactions,
  onAddTransaction,
  onRemoveTransaction,
  onSubmitTransactions,
  networkPrefix,
  getAddressFromDomain,
}: Props): ReactElement | null => {
  const services = useServices();
  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [addTxError, setAddTxError] = useState<string | undefined>();
  const [valueError, setValueError] = useState<string | undefined>();
  const [inputCache, setInputCache] = useState<string[]>([]);
  const [isValueInputVisible, setIsValueInputVisible] = useState(false);
  const [showCustomData, setShowCustomData] = useState<boolean>(false);
  const [customDataValue, setCustomDataValue] = useState<string>();
  const [addCustomTxDataError, setAddCustomTxDataError] = useState<string | undefined>();

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

  const handleCustomDataInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCustomDataValue(e.target.value);
    if (isHexStrict(e.target.value)) {
      setAddCustomTxDataError(undefined);
    } else {
      setAddCustomTxDataError(getCustomDataError(e.target.value));
    }
  }, []);

  const handleCustomDataSwitchChange = useCallback(() => {
    setShowCustomData(!showCustomData);
    setAddCustomTxDataError(undefined);
  }, [showCustomData]);

  const getTxData = useCallback(() => {
    let description = '';
    let data = '';

    if (!contract?.methods) {
      return;
    }

    if (!isInputValueValid(valueInput)) {
      setValueError(`${nativeCurrencySymbol} value`);
      return;
    }

    const method = contract.methods[selectedMethodIndex];

    if (!['receive', 'fallback'].includes(method.name)) {
      const parsedInputs: string[] = [];
      const inputDescription: string[] = [];

      method.inputs.forEach((input, index) => {
        const cleanValue = inputCache[index] || '';
        parsedInputs[index] = parseInputValue(input, cleanValue);
        inputDescription[index] = `${input.name || input.type}: ${cleanValue}`;
      });
      try {
        description = `${method.name} (${inputDescription.join(', ')})`;
        const abi = abiCoder as unknown; // a bug in the web3-eth-abi types
        data = (abi as AbiCoder).encodeFunctionCall(method as AbiItem, parsedInputs);

        return {
          data,
          description,
        };
      } catch (error) {
        throw error;
      }
    }
  }, [contract, inputCache, nativeCurrencySymbol, selectedMethodIndex, valueInput]);

  const addTransaction = async () => {
    let description = '';
    let data = '';

    if (valueError) {
      return;
    }

    if (showCustomData) {
      if (!isHexStrict(customDataValue as string)) {
        setAddCustomTxDataError(getCustomDataError(customDataValue));
        return;
      }

      data = customDataValue || '';
      description = customDataValue || '';
    } else if (contract && contract.methods.length > selectedMethodIndex) {
      try {
        const txData = getTxData();

        if (txData) {
          data = txData.data;
          description = txData.description;
        }
      } catch (error) {
        setAddTxError((error as Error).message);
        return;
      }
    }

    try {
      const cleanTo = toChecksumAddress(toInput);
      const cleanValue = toWei(valueInput || '0');

      if (data?.length === 0) {
        data = '0x';
        description = `Transfer ${fromWei(cleanValue.toString())} ${nativeCurrencySymbol} to ${cleanTo}`;
      }

      onAddTransaction({
        description,
        raw: { to: cleanTo, value: cleanValue, data },
      });

      setInputCache([]);
      setSelectedMethodIndex(0);
      setValueInput('');
      setCustomDataValue('');
      setAddTxError('');
      setAddCustomTxDataError('');
    } catch (e) {
      setAddTxError('There was an error trying to add the transaction.');
      console.error(e);
    }
  };

  const deleteTransaction = (inputIndex: number) => {
    onRemoveTransaction(inputIndex);
  };

  const onChangeToAddress = useCallback((address: string) => setToInput(address), []);

  const onValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueError(undefined);
    if (!isInputValueValid(e.target.value)) {
      setValueError(`Invalid ${nativeCurrencySymbol} value`);
    }
    setValueInput(e.target.value);
  };

  // Set toInput when to changes
  useEffect(() => {
    const value = isValidAddress(to) ? (to as string) : '';
    setToInput(value);
  }, [to]);

  // set when inputValue is visible
  useEffect(() => {
    if (showCustomData || !contract) {
      setIsValueInputVisible(true);
    } else if (contract) {
      const method = getContractMethod();
      setIsValueInputVisible(method?.payable || false);
    }
  }, [getContractMethod, showCustomData, contract, services, toInput]);

  useEffect(() => {
    if (transactions.length === 0) {
      setReviewing(false);
    }
  }, [transactions]);

  useEffect(() => {
    if (showCustomData) {
      setCustomDataValue('');
      try {
        const txData = getTxData();

        if (txData) {
          if (!isHexStrict(txData.data as string)) {
            setAddCustomTxDataError(getCustomDataError(txData.data));
          }
          setCustomDataValue(txData.data);
        }
      } catch (error) {
        return;
      }
    }
  }, [showCustomData, getTxData]);

  const renderInput = (input: any, index: number) => {
    const isBoolean = input.type === 'bool';

    if (isBoolean) {
      inputCache[index] = inputCache[index] || 'true';

      return (
        <StyledSelect
          items={BOOLEAN_ITEMS}
          activeItemId={inputCache[index]}
          onItemClick={(id: string) => {
            onChangeContractInput(index, id);
          }}
        />
      );
    }

    return (
      <StyledTextField
        name={'custom-data'}
        value={inputCache[index] || ''}
        label={`${input.name || ''}(${getInputHelper(input)})`}
        hiddenLabel={false}
        showErrorsInTheLabel
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeContractInput(index, e.target.value)}
      />
    );
  };

  if (!contract && !isValueInputVisible) {
    return null;
  }

  return (
    <>
      <Title size="xs">Transaction information</Title>
      {contract && !contract?.methods.length && <Text size="lg">Contract ABI doesn't have any public methods.</Text>}

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
        inputProps={{ value: toInput }}
      />

      {/* ValueInput */}
      {isValueInputVisible && (
        <StyledTextField
          name="token-value"
          style={{ marginTop: 10, marginBottom: 10 }}
          value={valueInput}
          label={`${nativeCurrencySymbol} value`}
          hiddenLabel={false}
          showErrorsInTheLabel
          error={valueError ?? undefined}
          onChange={onValueInputChange}
        />
      )}

      {/* Contract Inputs */}
      {!showCustomData && contract?.methods.length && (
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
              setInputCache([]);
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
              <div key={index} style={{ marginTop: 10 }}>
                {renderInput(input, index)}
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

      {/* hex encoded switcher*/}
      {showCustomData && (
        <StyledTextAreaField
          name="customDataValue"
          label="Data (hex encoded)*"
          hiddenLabel={false}
          value={customDataValue}
          error={addCustomTxDataError}
          onChange={handleCustomDataInputChange}
        />
      )}

      <Text size="lg">
        <Switch checked={showCustomData} onChange={handleCustomDataSwitchChange} />
        Use custom data (hex encoded)
      </Text>

      {/* Actions */}
      <ButtonContainer>
        <Button
          size="md"
          color="primary"
          disabled={!isValidAddress(toInput) && !contract?.methods.length}
          onClick={addTransaction}
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
