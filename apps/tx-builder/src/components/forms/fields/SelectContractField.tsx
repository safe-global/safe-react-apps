import { Select } from '@gnosis.pm/safe-react-components';
import { SelectItem } from '@gnosis.pm/safe-react-components/dist/inputs/Select';

type SelectContractFieldTypes = {
  options: SelectItem[];
  onChange: (id: string) => void;
  value: string;
  label: string;
  name: string;
};

const SelectContractField = ({ value, onChange, options, label, name }: SelectContractFieldTypes) => {
  return (
    <Select
      name={name}
      disabled={options.length === 1}
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
