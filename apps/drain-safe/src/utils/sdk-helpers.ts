import web3Utils, { AbiItem } from 'web3-utils';
import abiCoder, { AbiCoder } from 'web3-eth-abi';
import { Transaction } from '@gnosis.pm/safe-apps-sdk';
import { Asset } from './gateway';
import erc20 from '../abis/erc20';

export function encodeTxData(method: AbiItem, recipient: string, amount: string): string {
  const abi = abiCoder as unknown; // a bug in the web3-eth-abi types
  return (abi as AbiCoder).encodeFunctionCall(method, [web3Utils.toChecksumAddress(recipient), amount]);
}

export function tokenToTx(recipient: string, item: Asset): Transaction {
  return item.tokenInfo.type === 'ETHER'
    ? {
        // Send ETH directly to the recipient address
        to: web3Utils.toChecksumAddress(recipient),
        value: item.balance,
        data: '0x',
      }
    : {
        // For other token types, generate a contract tx
        to: web3Utils.toChecksumAddress(item.tokenInfo.address),
        value: '0',
        data: encodeTxData(erc20.transfer, recipient, item.balance),
      };
}
