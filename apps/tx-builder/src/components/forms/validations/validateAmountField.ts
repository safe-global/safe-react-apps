import { isInputValueValid } from '../../../utils';

function validateAmountField(value: string): string | undefined {
  if (!isInputValueValid(value)) {
    return 'Invalid Amount';
  }
}

export default validateAmountField;
