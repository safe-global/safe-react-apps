import styled from 'styled-components';
import { useCallback } from 'react';
import { AddressInput } from '@gnosis.pm/safe-react-components';
import { ContractInput } from '../../hooks/useServices/interfaceRepository';

type AddressContractFieldTypes = {
  onChangeContractInput: (index: number, value: string) => void;
  index: number;
  input: ContractInput;
  label: string;
  isValidAddress: (address: string | null) => boolean | undefined;
  inputCache: string[];
  networkPrefix: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

function AddressContractField({
  onChangeContractInput,
  index,
  input,
  label,
  isValidAddress,
  inputCache,
  networkPrefix,
  getAddressFromDomain,
}: AddressContractFieldTypes) {
  const onChangeAddress = useCallback(
    (address: string) => {
      onChangeContractInput(index, address);
    },
    [onChangeContractInput, index],
  );

  const error = inputCache[index] && !isValidAddress(inputCache[index]) ? 'Invalid Address' : '';

  return (
    <StyledAddressInput
      id={label}
      name={input.name}
      label={label}
      address={inputCache[index]}
      showNetworkPrefix={!!networkPrefix}
      networkPrefix={networkPrefix}
      hiddenLabel={false}
      error={error}
      getAddressFromDomain={getAddressFromDomain}
      onChangeAddress={onChangeAddress}
    />
  );
}

export default AddressContractField;

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
