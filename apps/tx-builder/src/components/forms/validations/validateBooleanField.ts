import { ValidateResult } from 'react-hook-form';

function validateBooleanField(value: string): ValidateResult {
  const cleanValue = value?.toLowerCase();

  const isValidBoolean = cleanValue === 'true' || cleanValue === 'false';

  if (!isValidBoolean) {
    return 'Invalid boolean value';
  }
}

export default validateBooleanField;
