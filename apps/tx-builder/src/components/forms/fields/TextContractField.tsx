import { TextFieldInput } from '@gnosis.pm/safe-react-components';
import { TextFieldInputProps } from '@gnosis.pm/safe-react-components/dist/inputs/TextFieldInput';
import styled from 'styled-components';

type TextContractFieldTypes = TextFieldInputProps & {
  networkPrefix?: undefined | string;
};

const TextContractField = ({ networkPrefix, ...props }: TextContractFieldTypes) => {
  return <StyledTextField {...props} hiddenLabel={false} />;
};

export default TextContractField;

const StyledTextField = styled(TextFieldInput)`
  && {
    width: 400px;
    margin-bottom: 10px;

    .MuiFormLabel-root {
      color: ${(props) => (!!props.error ? '#f44336' : '#0000008a')};
    }

    .MuiFormLabel-root.Mui-focused {
      color: ${(props) => (!!props.error ? '#f44336' : '#008c73')};
    }

    textarea {
      &.MuiInputBase-input {
        padding: 0;
      }
    }
  }
`;
