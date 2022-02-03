import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ButtonLink, Switch, Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

import { ContractInterface } from '../../hooks/useServices/interfaceRepository';
import {
  ADDRESS_FIELD_TYPE,
  AMOUNT_FIELD_TYPE,
  CONTRACT_METHOD_FIELD_TYPE,
  HEX_ENCODED_DATA_FIELD_TYPE,
} from './fields/fields';
import Field from './fields/Field';
import { Examples } from '../Examples';
import { encodeToHexData } from '../../utils';

export const TO_ADDRESS_FIELD_NAME = 'toAddress';
export const TOKEN_INPUT_NAME = 'tokenValue';
export const CONTRACT_METHOD_INDEX_FIELD_NAME = 'contractMethodIndex';
export const CONTRACT_VALUES_FIELD_NAME = 'contractFieldsValues';
export const HEX_ENCODED_DATA_FIELD_NAME = 'hexEncodedData';

type SolidityFormPropsTypes = {
  id: string;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
  nativeCurrencySymbol: undefined | string;
  contract: ContractInterface | null;
  onSubmit: SubmitHandler<SolodityFormValues>;
  initialValues: SolodityInitialFormValues;
  children: React.ReactNode;
};

export type SolodityInitialFormValues = {
  [TO_ADDRESS_FIELD_NAME]: string;
  [CONTRACT_METHOD_INDEX_FIELD_NAME]: string;
};

export type SolodityFormValues = {
  [TO_ADDRESS_FIELD_NAME]: string;
  [TOKEN_INPUT_NAME]: string;
  [CONTRACT_METHOD_INDEX_FIELD_NAME]: string;
  [CONTRACT_VALUES_FIELD_NAME]: Record<string, string>;
  [HEX_ENCODED_DATA_FIELD_NAME]: string;
};

const SolidityForm = ({
  id,
  onSubmit,
  getAddressFromDomain,
  initialValues,
  nativeCurrencySymbol,
  networkPrefix,
  contract,
  children,
}: SolidityFormPropsTypes) => {
  const [showExamples, setShowExamples] = useState<boolean>(false);
  const [showHexEncodedData, setShowHexEncodedData] = useState<boolean>(false);

  const { handleSubmit, control, setValue, watch, getValues, reset, clearErrors } = useForm<SolodityFormValues>({
    defaultValues: initialValues,
    mode: 'all', // This option allows you to configure the validation strategy before the user submits the form
  });

  const contractMethodIndex = watch(CONTRACT_METHOD_INDEX_FIELD_NAME);
  const contractMethod = contract?.methods[Number(contractMethodIndex)];
  const contractFields = contractMethod?.inputs || [];
  const showContractFields = !!contract && !showHexEncodedData;
  const isPayableMethod = !!contract && contractMethod?.payable;

  const isValueInputVisible = showHexEncodedData || !contract || isPayableMethod;

  function onClickShowHexEncodedData(checked: boolean) {
    const contractFieldsValues = getValues(CONTRACT_VALUES_FIELD_NAME);

    if (checked && contractMethod) {
      const encodeData = encodeToHexData(contractMethod, contractFieldsValues);
      setValue(HEX_ENCODED_DATA_FIELD_NAME, encodeData || '');
    }
    setShowHexEncodedData(checked);
  }

  function submitAndResetForm(values: SolodityFormValues) {
    onSubmit(values);
    reset(initialValues);
    setTimeout(clearErrors, 0);
  }

  return (
    <form id={id} onSubmit={handleSubmit(submitAndResetForm)} noValidate>
      {/* To Address field */}
      <Field
        id="to-address-input"
        name={TO_ADDRESS_FIELD_NAME}
        label="To Address"
        fullWidth
        required
        getAddressFromDomain={getAddressFromDomain}
        networkPrefix={networkPrefix}
        fieldType={ADDRESS_FIELD_TYPE}
        control={control}
        showErrorsInTheLabel={false}
      />

      {/* Native Token Amount Input */}
      <Field
        id="token-value-input"
        name={TOKEN_INPUT_NAME}
        label={`${nativeCurrencySymbol} value`}
        fieldType={AMOUNT_FIELD_TYPE}
        fullWidth
        required
        showField={isValueInputVisible}
        control={control}
        showErrorsInTheLabel={false}
      />

      {/* Contract Section */}

      {/* Contract Method Selector */}
      <Field
        id="contract-method-selector"
        name={CONTRACT_METHOD_INDEX_FIELD_NAME}
        label="Contract Method Selector"
        fieldType={CONTRACT_METHOD_FIELD_TYPE}
        showField={showContractFields}
        shouldUnregister={false}
        control={control}
        options={contract?.methods.map((method, index) => ({
          id: index.toString(),
          label: method.name,
        }))}
        required
      />

      {/* Show examples link */}
      {showContractFields && (
        <StyledExamples>
          <ButtonLink type="button" color="primary" onClick={() => setShowExamples((prev) => !prev)}>
            {showExamples ? 'Hide Examples' : 'Show Examples'}
          </ButtonLink>

          {showExamples && <Examples />}
        </StyledExamples>
      )}

      {/* Contract Fields */}
      {contractFields.map((contractField, index) => {
        const name = `${CONTRACT_VALUES_FIELD_NAME}.${contractField.name || index}`;
        return (
          <Field
            key={name}
            id={`contract-field-${contractField.name || index}`}
            name={name}
            label={`${contractField.name || `${index + 1}º contract field`} (${contractField.type})`}
            fieldType={contractField.type}
            fullWidth
            required
            shouldUnregister={false} // required to keep contract field values in the form state when the user switches between encoding and decoding data
            showField={showContractFields}
            control={control}
            showErrorsInTheLabel={false}
            getAddressFromDomain={getAddressFromDomain}
            networkPrefix={networkPrefix}
          />
        );
      })}

      {/* Hex encoded textarea field */}
      <Field
        id="hex-encoded-data"
        name={HEX_ENCODED_DATA_FIELD_NAME}
        label="Data (Hex encoded)"
        fieldType={HEX_ENCODED_DATA_FIELD_TYPE}
        showField={showHexEncodedData}
        required
        fullWidth
        control={control}
        showErrorsInTheLabel={false}
      />

      {/* Switch button to encoding contract fields values to hex data */}
      <Text size="lg">
        <Switch checked={showHexEncodedData} onChange={onClickShowHexEncodedData} />
        Use custom data (hex encoded)
      </Text>

      {/* action buttons as a children */}
      {children}
    </form>
  );
};

export default SolidityForm;

const StyledExamples = styled.div`
  margin: 5px 0 10px 0;

  button {
    padding: 0;
  }
`;
