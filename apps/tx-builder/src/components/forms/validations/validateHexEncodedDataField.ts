import { isHexStrict } from 'web3-utils';

import { getCustomDataError } from '../../../utils';

function validateHexEncodedDataField(value: string): string | undefined {
  if (!isHexStrict(value)) {
    return getCustomDataError(value);
  }
}

export default validateHexEncodedDataField;
