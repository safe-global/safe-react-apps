import { ReactElement } from 'react';
import { Control, Controller } from 'react-hook-form';
import { SelectItem } from '@gnosis.pm/safe-react-components/dist/inputs/Select';

import {
  ADDRESS_FIELD_TYPE,
  BOOLEAN_FIELD_TYPE,
  CONTRACT_METHOD_FIELD_TYPE,
  CUSTOM_TRANSACTION_DATA_FIELD_TYPE,
  SolidityFieldTypes,
  CustomFieldTypes,
} from './fields';
import AddressContractField from './AddressContractField';
import SelectContractField from './SelectContractField';
import TextareaContractField from './TextareaContractField';
import TextContractField from './TextContractField';
import validateField from '../validations/validateField';

const CUSTOM_SOLIDITY_COMPONENTS: CustomSolidityComponent = {
  [ADDRESS_FIELD_TYPE]: AddressContractField,
  [BOOLEAN_FIELD_TYPE]: SelectContractField,
  [CONTRACT_METHOD_FIELD_TYPE]: SelectContractField,
  [CUSTOM_TRANSACTION_DATA_FIELD_TYPE]: TextareaContractField,
};

const CUSTOM_DEFAULT_VALUES: CustomDefaultValueTypes = {
  [BOOLEAN_FIELD_TYPE]: 'true',
  [CONTRACT_METHOD_FIELD_TYPE]: '0', // first contract method as default
};

const BOOLEAN_DEFAULT_OPTIONS: SelectItem[] = [
  { id: 'true', label: 'True' },
  { id: 'false', label: 'False' },
];

const DEFAULT_OPTIONS: DefaultOptionTypes = {
  [BOOLEAN_FIELD_TYPE]: BOOLEAN_DEFAULT_OPTIONS,
};

interface CustomDefaultValueTypes {
  [key: string]: string;
}

interface CustomSolidityComponent {
  [key: string]: (props: any) => ReactElement;
}

interface DefaultOptionTypes {
  [key: string]: SelectItem[];
}

type FieldProps = {
  fieldType: SolidityFieldTypes | CustomFieldTypes;
  control: Control<any, object>;
  id: string;
  name: string;
  label: string;
  fullWidth?: boolean;
  required?: boolean;
  getAddressFromDomain?: (name: string) => Promise<string>;
  networkPrefix?: string;
  showErrorsInTheLabel?: boolean;
  shouldUnregister?: boolean;
  options?: SelectItem[];
};

const Field = ({
  fieldType,
  control,
  name,
  shouldUnregister = true,
  options,
  required = true,
  ...props
}: FieldProps) => {
  // Component based on field type
  const Component = CUSTOM_SOLIDITY_COMPONENTS[fieldType] || TextContractField;

  // see https://react-hook-form.com/advanced-usage#ControlledmixedwithUncontrolledComponents
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={CUSTOM_DEFAULT_VALUES[fieldType] || ''}
      shouldUnregister={shouldUnregister}
      rules={{
        required: {
          value: required,
          message: 'Required',
        },
        validate: validateField(fieldType),
      }}
      render={({ field, fieldState }) => (
        <Component
          name={field.name}
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          options={options || DEFAULT_OPTIONS[fieldType]}
          error={fieldState.error?.message}
          required={required}
          {...props}
        />
      )}
    />
  );
};

export default Field;
