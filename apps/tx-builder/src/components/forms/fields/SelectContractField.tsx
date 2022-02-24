import { Select } from '@gnosis.pm/safe-react-components';
import { SelectItem } from '@gnosis.pm/safe-react-components/dist/inputs/Select';
import styled from 'styled-components';

type SelectContractFieldTypes = {
  options: SelectItem[];
  onChange: (id: string) => void;
  value: string;
};

const SelectContractField = ({ value, onChange, options }: SelectContractFieldTypes) => {
  return (
    <StyledSelect
      name="select-contract"
      label="Select Contract"
      items={options}
      fullWidth
      activeItemId={value}
      onItemClick={(id: string) => {
        onChange(id);
      }}
    />
  );
};

export default SelectContractField;

const StyledSelect = styled(Select)`
  margin-bottom: 10px;
`;
