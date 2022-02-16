import styled from 'styled-components';
import { ReactElement } from 'react';
import { AddressInput } from '@gnosis.pm/safe-react-components';
import { errorBaseStyles } from '../styles';

const AddressContractField = ({
  id,
  name,
  value,
  onChange,
  label,
  error,
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
    ${errorBaseStyles}
  }
`;
