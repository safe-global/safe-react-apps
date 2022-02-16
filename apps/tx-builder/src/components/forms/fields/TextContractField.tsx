import { TextFieldInput } from '@gnosis.pm/safe-react-components';
import { TextFieldInputProps } from '@gnosis.pm/safe-react-components/dist/inputs/TextFieldInput';
import styled from 'styled-components';
import { errorBaseStyles } from '../styles';

type TextContractFieldTypes = TextFieldInputProps & {
  networkPrefix?: undefined | string;
  getAddressFromDomain?: (name: string) => Promise<string>;
};

const TextContractField = ({ getAddressFromDomain, networkPrefix, ...props }: TextContractFieldTypes) => {
  return <StyledTextField {...props} hiddenLabel={false} />;
};

export default TextContractField;

const StyledTextField = styled(TextFieldInput)`
  && {
    width: 400px;
    margin-bottom: 10px;
    ${errorBaseStyles}
    textarea {
      &.MuiInputBase-input {
        padding: 0;
      }
    }
  }
`;
