import { Select } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

function SelectContractField({ value, onChange, options }: any) {
  return (
    <StyledSelect
      items={options}
      activeItemId={value}
      onItemClick={(id: string) => {
        onChange(id);
      }}
    />
  );
}

export default SelectContractField;

const StyledSelect = styled(Select)`
  margin-bottom: 10px;
  width: 520px;
`;
