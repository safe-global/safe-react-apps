import styled from 'styled-components';
import { AddressInput } from '@gnosis.pm/safe-react-components';

export default styled(AddressInput)`
  && {
    width: 520px;

    .MuiFormLabel-root {
      color: #0000008a;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #008c73;
    }
  }
`;
