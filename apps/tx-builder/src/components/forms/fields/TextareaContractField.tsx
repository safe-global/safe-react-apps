import { TextFieldInputProps } from '@gnosis.pm/safe-react-components/dist/inputs/TextFieldInput';
import TextContractField from './TextContractField';

const DEFAULT_ROWS = 4;

function TextareaContractField(props: TextFieldInputProps) {
  return <TextContractField {...props} multiline rows={DEFAULT_ROWS} />;
}

export default TextareaContractField;
