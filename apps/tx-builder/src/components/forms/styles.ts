import { css } from 'styled-components';
import { TextFieldInputProps } from '@gnosis.pm/safe-react-components/dist/inputs/TextFieldInput';

export const errorBaseStyles = css<TextFieldInputProps>`
  .MuiFormLabel-root {
    color: ${(props) => (!!props.error ? '#f44336' : '#0000008a')};
  }

  .MuiFormLabel-root.Mui-focused {
    color: ${(props) => (!!props.error ? '#f44336' : '#008c73')};
  }
`;
