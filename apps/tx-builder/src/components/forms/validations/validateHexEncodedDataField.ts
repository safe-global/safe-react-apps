import { isHexStrict } from 'web3-utils';
import { ValidateResult } from 'react-hook-form';

import { getCustomDataError } from '../../../utils';

function validateHexEncodedDataField(value: string): ValidateResult {
  if (!isHexStrict(value)) {
    return getCustomDataError(value);
  }
}

export default validateHexEncodedDataField;
