import { Select } from '@gnosis.pm/safe-react-components';
import { SelectItem } from '@gnosis.pm/safe-react-components/dist/inputs/Select';
import styled from 'styled-components';

type SelectContractFieldTypes = {
  options: SelectItem[];
  onChange: (id: string) => void;
  value: string;
  label: string;
  name: string;
};

const SelectContractField = ({ value, onChange, options, label, name }: SelectContractFieldTypes) => {
  return (
    <StyledSelect
      name={name}
      label={label}
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
