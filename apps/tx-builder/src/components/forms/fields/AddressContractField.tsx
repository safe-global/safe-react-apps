import styled from 'styled-components';
import { ReactElement } from 'react';
import { AddressInput } from '@gnosis.pm/safe-react-components';

const AddressContractField = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
  getAddressFromDomain,
  networkPrefix,
  onBlur,
}: any): ReactElement => {
  return (
    <StyledAddressInput
      id={id}
      name={name}
      label={label}
      address={value}
      inputProps={{ value }}
      onBlur={onBlur}
      showNetworkPrefix={!!networkPrefix}
      networkPrefix={networkPrefix}
      hiddenLabel={false}
      error={error}
      getAddressFromDomain={getAddressFromDomain}
      onChangeAddress={onChange}
      showErrorsInTheLabel={false}
    />
  );
};

export default AddressContractField;

const StyledAddressInput = styled(AddressInput)`
  && {
    width: 400px;
    margin-bottom: 10px;

    .MuiFormLabel-root {
      color: ${(props) => (!!props.error ? '#f44336' : '#0000008a')};
    }

    .MuiFormLabel-root.Mui-focused {
      color: ${(props) => (!!props.error ? '#f44336' : '#008c73')};
    }
  }
`;
