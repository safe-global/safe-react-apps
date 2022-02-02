import { isValidAddress } from '../../../utils';

function validateAddressField(value: string): string | undefined {
  if (!isValidAddress(value)) {
    return 'Invalid Address';
  }
}

export default validateAddressField;
