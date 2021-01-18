// Type for gs_multi_send transaction, taken from https://github.com/gnosis/contract-proxy-kit/blob/master/src/utils/transactions.ts#L31
export type NumberLike = number | string | bigint;

export interface MetaTx {
  to: string;
  value?: NumberLike;
  data?: string;
}

function isDecimalString(value: string): boolean {
  return !value.match(/^[0-9]*$/);
}

function isHexString(value: string, length?: number) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && value.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}

function isNumberLike(object: any): object is MetaTx {
  if (typeof object === 'string' && !isHexString(object) && !isDecimalString(object)) return false;
  return typeof object in ['number', 'string', 'bigint'];
}

export function isMetaTx(object: any): object is MetaTx {
  if (typeof object.to !== 'string') return false;
  if (object.value && isNumberLike(object.value)) return false;
  if (object.data && !isHexString(object.data)) return false;
  // Make sure that operation is not set to avoid unexpected behaviour
  if (typeof object.operation !== 'undefined') return false;
  return true;
}

export function isMetaTxArray(object: any): object is MetaTx[] {
  if (!Array.isArray(object)) return false;
  for (let tx of object) {
    if (!isMetaTx(tx)) return false;
  }
  return true;
}
