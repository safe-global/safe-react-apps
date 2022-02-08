import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';
import { isAddress } from 'web3-utils';
import getAbi from './getAbi';

export interface ContractInput {
  internalType: string;
  name: string;
  type: string;
}

export interface ContractMethod {
  inputs: ContractInput[];
  name: string;
  payable: boolean;
}

export interface ContractInterface {
  methods: ContractMethod[];
}

class InterfaceRepository {
  chainInfo: ChainInfo;

  constructor(chainInfo: ChainInfo) {
    this.chainInfo = chainInfo;
  }

  private async _loadAbiFromBlockExplorer(address: string): Promise<string> {
    return await getAbi(address, this.chainInfo);
  }

  private _isMethodPayable = (m: any) => m.payable || m.stateMutability === 'payable';

  async loadAbi(address: string): Promise<string> {
    return await this._loadAbiFromBlockExplorer(address);
  }

  getMethods(abi: string): ContractInterface {
    let json;

    try {
      json = JSON.parse(abi);
    } catch {
      return { methods: [] };
    }

    if (!Array.isArray(json)) {
      return { methods: [] };
    }

    const methods = json
      .filter((e: any) => {
        if (['pure', 'view'].includes(e.stateMutability)) {
          return false;
        }

        if (e?.type.toLowerCase() === 'event') {
          return false;
        }

        return !e.constant;
      })
      .filter((m: any) => m.type !== 'constructor')
      .map((m: any) => {
        return {
          inputs: m.inputs || [],
          name: m.name || (m.type === 'fallback' ? 'fallback' : 'receive'),
          payable: this._isMethodPayable(m),
        };
      });

    return { methods };
  }
}

export type InterfaceRepo = InstanceType<typeof InterfaceRepository>;

export default InterfaceRepository;
