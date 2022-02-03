import { ValidateResult } from 'react-hook-form';

import { isValidAddress } from '../../../utils';

function validateAddressField(value: string): ValidateResult {
  if (!isValidAddress(value)) {
    return 'Invalid address';
  }
}

export default validateAddressField;
