import { ReactElement, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { SelectItem } from '@gnosis.pm/safe-react-components/dist/inputs/Select';

import {
  ADDRESS_FIELD_TYPE,
  BOOLEAN_FIELD_TYPE,
  CONTRACT_METHOD_FIELD_TYPE,
  HEX_ENCODED_DATA_FIELD_TYPE,
} from './constants/fields';
import AddressContractField from './AddressContractField';
import SelectContractField from './SelectContractField';
import ContractTextField from './ContractTextField';
import validateField from './validations/validations';
import TextareaContractField from './TextareaContractField';

function Field({ fieldType, control, name, showField = true, unregister, options, ...props }: any) {
  useEffect(() => {
    // TODO: remove this unnecesary useEffect ???? we manually unregister a field when we hide it
    if (!showField) {
      unregister(name);
    }
  }, [showField, unregister, name]);

  // Component based on field type
  const Component = CUSTOM_SOLIDITY_COMPONENTS[fieldType] || ContractTextField;

  return (
    showField && (
      // see https://react-hook-form.com/advanced-usage#ControlledmixedwithUncontrolledComponents
      <Controller
        name={name}
        control={control}
        defaultValue={CUSTOM_DEFAULT_VALUES[fieldType]}
        shouldUnregister
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
          validate: validateField(fieldType),
        }}
        render={({ field, fieldState, formState }) => (
          <Component
            name={field.name}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            field={field}
            options={options || DEFAULT_OPTIONS[fieldType]}
            error={fieldState.error?.message}
            // formState={formState}
            // fieldState={fieldState}
            {...props}
          />
        )}
      />
    )
  );
}

export default Field;

const CUSTOM_SOLIDITY_COMPONENTS: CustomSolidityComponent = {
  [ADDRESS_FIELD_TYPE]: AddressContractField,
  [BOOLEAN_FIELD_TYPE]: SelectContractField,
  [CONTRACT_METHOD_FIELD_TYPE]: SelectContractField,
  [HEX_ENCODED_DATA_FIELD_TYPE]: TextareaContractField,
};

const CUSTOM_DEFAULT_VALUES: CustomDefaultValueTypes = {
  [BOOLEAN_FIELD_TYPE]: 'true',
  [CONTRACT_METHOD_FIELD_TYPE]: 0, // first contract method as default
};

const BOOLEAN_DEFAULT_OPTIONS: SelectItem[] = [
  { id: 'true', label: 'True' },
  { id: 'false', label: 'False' },
];

const DEFAULT_OPTIONS: DefaultOptionTypes = {
  [BOOLEAN_FIELD_TYPE]: BOOLEAN_DEFAULT_OPTIONS,
};

interface CustomDefaultValueTypes {
  [key: string]: string | number;
}

interface CustomSolidityComponent {
  [key: string]: (props: any) => ReactElement;
}

interface DefaultOptionTypes {
  [key: string]: SelectItem[];
}
