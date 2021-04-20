import utils, { AbiItem } from 'web3-utils';
import abiCoder, { AbiCoder } from 'web3-eth-abi';

export const fetchJson = async function fetchJson(url: string): Promise<unknown> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Network response was not ok');
  }
  return resp.json();
};

export const encodeTxData = (method: AbiItem, recipient: string, amount: string): string => {
  const abi = abiCoder as unknown; // a bug in the web3-eth-abi types
  return (abi as AbiCoder).encodeFunctionCall(method, [utils.toChecksumAddress(recipient), amount]);
};
