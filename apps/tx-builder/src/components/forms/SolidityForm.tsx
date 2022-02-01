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
} from '../fields/constants/fields';
import Field from '../fields/Fields';
import { Examples } from '../Examples';
import { encodeToHexData } from '../../utils';

type SolidityFormTypes = {
  id: string;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
  nativeCurrencySymbol: undefined | string;
  contract: ContractInterface | null;
  onSubmit: SubmitHandler<Record<string, string | number | undefined>>;
  children: React.ReactNode;
  initialValues: Record<string, string | number | undefined>;
};

function SolidityForm({
  id,
  onSubmit,
  getAddressFromDomain,
  initialValues,
  nativeCurrencySymbol,
  networkPrefix,
  contract,
  children,
}: SolidityFormTypes) {
  const [showExamples, setShowExamples] = useState<boolean>(false);
  const [showHexEncodedData, setShowHexEncodedData] = useState<boolean>(false);

  const { handleSubmit, control, setValue, watch, getValues, unregister } = useForm({
    defaultValues: initialValues,
    mode: 'onTouched', // This option allows you to configure the validation strategy before the user submits the form
  });

  const contractMethodIndex = watch('contractMethodIndex');
  const contractMethod = contract?.methods[contractMethodIndex as number];
  const contractFields = contractMethod?.inputs || [];

  const showContractFields = !!contract && !showHexEncodedData;
  const contractMethodOptions = contract?.methods.map((method, index) => ({
    id: index.toString(),
    label: method.name,
  }));

  const isPayableMethod = !!contract && contractMethod?.payable;
  const isValueInputVisible = showHexEncodedData || !contract || isPayableMethod;

  function onClickShowHexEncodedData(checked: boolean) {
    const contractFieldsValues = getValues('contractFieldsValues');

    if (checked && contractMethod && contractFieldsValues) {
      const encodeData = encodeToHexData(contractMethod, contractFieldsValues);
      setValue('hexEncodedData', encodeData);
    }
    setShowHexEncodedData(checked);
  }

  console.log('contractMethodIndex: ', contractMethodIndex);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* To Address field */}
      <Field
        id="to-address-input"
        name="toAddress"
        label="To Address"
        fullWidth
        required
        getAddressFromDomain={getAddressFromDomain}
        networkPrefix={networkPrefix}
        fieldType={ADDRESS_FIELD_TYPE}
        control={control}
        unregister={unregister}
        showErrorsInTheLabel={false}
      />

      {/* Token Amount Input */}
      <Field
        id="token-value-input"
        name="tokenValue"
        label={`${nativeCurrencySymbol} value`}
        fieldType={AMOUNT_FIELD_TYPE}
        fullWidth
        required
        showField={isValueInputVisible}
        control={control}
        unregister={unregister}
        showErrorsInTheLabel={false}
      />

      {/* Contract Section */}

      {/* Contract Method Selector */}
      <Field
        id="contract-method-selector"
        name="contractMethodIndex"
        fieldType={CONTRACT_METHOD_FIELD_TYPE}
        options={contractMethodOptions}
        fullWidth
        required
        showField={showContractFields}
        control={control}
        unregister={unregister}
        showErrorsInTheLabel={false}
      />

      {/* Show examples link TODO: Refactor this ? */}
      {showContractFields && (
        <StyledExamples>
          <ButtonLink color="primary" onClick={() => setShowExamples((prev) => !prev)}>
            {showExamples ? 'Hide Examples' : 'Show Examples'}
          </ButtonLink>

          {showExamples && <Examples />}
        </StyledExamples>
      )}

      {/* Contract Fields */}
      {contractFields.map((contractField, index) => {
        const name = `contractFieldsValues.${contractField.name || index}`;
        return (
          <Field
            key={name}
            id={`contract-field-${contractField.name || index}`}
            name={name}
            label={`${contractField.name || `${index + 1}º contract field`} (${contractField.type})`}
            fieldType={contractField.type}
            fullWidth
            required
            showField={showContractFields}
            control={control}
            unregister={unregister}
            showErrorsInTheLabel={false}
            getAddressFromDomain={getAddressFromDomain}
            networkPrefix={networkPrefix}
          />
        );
      })}

      {/* hex encoded textarea field */}
      <Field
        id="hex-encoded-data"
        name="hexEncodedData"
        label="Data (Hex encoded)"
        fieldType={HEX_ENCODED_DATA_FIELD_TYPE}
        showField={showHexEncodedData}
        required
        fullWidth
        control={control}
        unregister={unregister}
        showErrorsInTheLabel={false}
      />

      {/* Switch button */}
      <Text size="lg">
        <Switch checked={showHexEncodedData} onChange={onClickShowHexEncodedData} />
        Use custom data (hex encoded)
      </Text>

      {/* action buttons as a children */}
      {children}
    </form>
  );
}

export default SolidityForm;

const StyledExamples = styled.div`
  margin: 5px 0 10px 0;

  button {
    padding: 0;
  }
`;
