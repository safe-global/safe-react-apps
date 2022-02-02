import { ValidateResult } from 'react-hook-form';

import { isInputValueValid } from '../../../utils';

function validateAmountField(value: string): ValidateResult {
  if (!isInputValueValid(value)) {
    return 'Invalid Amount';
  }
}

export default validateAmountField;
