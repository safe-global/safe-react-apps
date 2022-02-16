import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ButtonLink, Switch, Text } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { DevTool } from '@hookform/devtools';
import { toChecksumAddress, toWei } from 'web3-utils';

import { ContractInterface } from '../../hooks/useServices/interfaceRepository';
import {
  ADDRESS_FIELD_TYPE,
  CONTRACT_METHOD_FIELD_TYPE,
  HEX_ENCODED_DATA_FIELD_TYPE,
  NATIVE_AMOUNT_FIELD_TYPE,
  SolidityFieldTypes,
} from './fields/fields';
import Field from './fields/Field';
import { Examples } from '../Examples';
import { encodeToHexData } from '../../utils';
import { ProposedTransaction } from '../../typings/models';

export const TO_ADDRESS_FIELD_NAME = 'toAddress';
export const NATIVE_VALUE_FIELD_NAME = 'nativeAmount';
export const CONTRACT_METHOD_INDEX_FIELD_NAME = 'contractMethodIndex';
export const CONTRACT_VALUES_FIELD_NAME = 'contractFieldsValues';
export const HEX_ENCODED_DATA_FIELD_NAME = 'hexEncodedData';

type SolidityFormPropsTypes = {
  id: string;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
  nativeCurrencySymbol: undefined | string;
  contract: ContractInterface | null;
  onSubmit: SubmitHandler<SolidityFormValuesTypes>;
  initialValues?: Partial<SolidityInitialFormValuesTypes>;
  defaultHexDataView?: boolean;
  hideHexToggler?: boolean;
  children: React.ReactNode;
};

export type SolidityInitialFormValuesTypes = {
  [TO_ADDRESS_FIELD_NAME]: string;
  [CONTRACT_METHOD_INDEX_FIELD_NAME]: string;
};

export type SolidityFormValuesTypes = {
  [TO_ADDRESS_FIELD_NAME]: string;
  [NATIVE_VALUE_FIELD_NAME]: string;
  [CONTRACT_METHOD_INDEX_FIELD_NAME]: string;
  [CONTRACT_VALUES_FIELD_NAME]: Record<string, string>;
  [HEX_ENCODED_DATA_FIELD_NAME]: string;
};

export const parseFormToProposedTransaction = (
  values: SolidityFormValuesTypes,
  contract: ContractInterface | null,
): ProposedTransaction => {
  const contractMethodIndex = values[CONTRACT_METHOD_INDEX_FIELD_NAME];
  const toAddress = values[TO_ADDRESS_FIELD_NAME];
  const tokenValue = values[NATIVE_VALUE_FIELD_NAME];
  const contractFieldsValues = values[CONTRACT_VALUES_FIELD_NAME];
  const hexEncodedData = values[HEX_ENCODED_DATA_FIELD_NAME];

  const contractMethod = contract?.methods[Number(contractMethodIndex)];

  const data = hexEncodedData || encodeToHexData(contractMethod, contractFieldsValues) || '0x';
  const to = toChecksumAddress(toAddress);
  const value = toWei(tokenValue || '0');

  return {
    id: new Date().getTime(),
    contractInterface: contract,
    description: {
      to,
      value,
      hexEncodedData,
      contractMethod,
      contractFieldsValues,
      contractMethodIndex,
    },
    raw: { to, value, data },
  };
};

const isProdEnv = process.env.NODE_ENV === 'production';

const SolidityForm = ({
  id,
  onSubmit,
  getAddressFromDomain,
  initialValues,
  nativeCurrencySymbol,
  networkPrefix,
  contract,
  defaultHexDataView,
  hideHexToggler,
  children,
}: SolidityFormPropsTypes) => {
  const [showExamples, setShowExamples] = useState<boolean>(false);
  const [showHexEncodedData, setShowHexEncodedData] = useState<boolean>(!!defaultHexDataView);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<SolidityFormValuesTypes>({
    defaultValues: initialValues,
    mode: 'onTouched', // This option allows you to configure the validation strategy before the user submits the form
  });

  const toAddress = watch(TO_ADDRESS_FIELD_NAME);
  const contractMethodIndex = watch(CONTRACT_METHOD_INDEX_FIELD_NAME);
  const contractMethod = contract?.methods[Number(contractMethodIndex)];

  const contractFields = contractMethod?.inputs || [];
  const showContractFields = !!contract && !showHexEncodedData;
  const isPayableMethod = !!contract && contractMethod?.payable;

  const isValueInputVisible = showHexEncodedData || !contract || isPayableMethod;
  console.log({ showHexEncodedData, isPayableMethod, isValueInputVisible, contract });
  const onClickShowHexEncodedData = (checked: boolean) => {
    const contractFieldsValues = getValues(CONTRACT_VALUES_FIELD_NAME);

    if (checked && contractMethod) {
      const encodeData = encodeToHexData(contractMethod, contractFieldsValues);
      setValue(HEX_ENCODED_DATA_FIELD_NAME, encodeData || '');
    }
    setShowHexEncodedData(checked);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...initialValues, [TO_ADDRESS_FIELD_NAME]: toAddress });
    }
  }, [isSubmitSuccessful, reset, toAddress, initialValues]);

  return (
    <>
      <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
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
        {isValueInputVisible && (
          <Field
            id="token-value-input"
            name={NATIVE_VALUE_FIELD_NAME}
            label={`${nativeCurrencySymbol} value`}
            fieldType={NATIVE_AMOUNT_FIELD_TYPE}
            fullWidth
            required
            control={control}
            showErrorsInTheLabel={false}
          />
        )}
        {/* Contract Section */}
        {/* Contract Method Selector */}
        {showContractFields && (
          <Field
            id="contract-method-selector"
            name={CONTRACT_METHOD_INDEX_FIELD_NAME}
            label="Contract Method Selector"
            fieldType={CONTRACT_METHOD_FIELD_TYPE}
            shouldUnregister={false}
            control={control}
            options={contract?.methods.map((method, index) => ({
              id: index.toString(),
              label: method.name,
            }))}
            required
          />
        )}
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
            showContractFields && (
              <Field
                key={name}
                id={`contract-field-${contractField.name || index}`}
                name={name}
                label={`${contractField.name || `${index + 1}º contract field`} (${contractField.type})`}
                fieldType={contractField.type as SolidityFieldTypes}
                fullWidth
                required
                shouldUnregister={false} // required to keep contract field values in the form state when the user switches between encoding and decoding data
                control={control}
                showErrorsInTheLabel={false}
                getAddressFromDomain={getAddressFromDomain}
                networkPrefix={networkPrefix}
              />
            )
          );
        })}

        {/* Hex encoded textarea field */}
        {showHexEncodedData && (
          <Field
            id="hex-encoded-data"
            name={HEX_ENCODED_DATA_FIELD_NAME}
            label="Data (Hex encoded)"
            fieldType={HEX_ENCODED_DATA_FIELD_TYPE}
            required
            fullWidth
            control={control}
            showErrorsInTheLabel={false}
          />
        )}
        {/* Switch button to encoding contract fields values to hex data */}
        {!hideHexToggler && (
          <Text size="lg">
            <Switch checked={showHexEncodedData} onChange={onClickShowHexEncodedData} />
            Use custom data (hex encoded)
          </Text>
        )}
        {/* action buttons as a children */}
        {children}
      </form>

      {/* set up the dev tool only in dev env */}
      {!isProdEnv && <DevTool control={control} />}
    </>
  );
};

export default SolidityForm;

const StyledExamples = styled.div`
  margin: 5px 0 10px 0;

  button {
    padding: 0;
  }
`;
