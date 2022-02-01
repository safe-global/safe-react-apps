import { TextFieldInputProps } from '@gnosis.pm/safe-react-components/dist/inputs/TextFieldInput';
import ContractTextField from './ContractTextField';

const DEFAULT_ROWS = 4;

function TextareaContractField(props: TextFieldInputProps) {
  return <ContractTextField {...props} multiline rows={DEFAULT_ROWS} />;
}

export default TextareaContractField;
