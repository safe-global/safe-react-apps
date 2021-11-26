import getAbi from './getAbi';

interface ContractMethod {
  inputs: any[];
  name: string;
  payable: boolean;
}

export interface ContractInterface {
  methods: ContractMethod[];
}

class InterfaceRepository {
  chainId: string;
  web3: any;

  constructor(chainId: string, web3: any) {
    this.chainId = chainId;
    this.web3 = web3;
  }

  private async _loadAbiFromBlockExplorer(address: string): Promise<string> {
    return await getAbi(address, this.chainId);
  }

  private _isMethodPayable = (m: any) => m.payable || m.stateMutability === 'payable';

  async loadAbi(addressOrAbi: string): Promise<ContractInterface> {
    const abi = this.web3.utils.isAddress(addressOrAbi)
      ? await this._loadAbiFromBlockExplorer(addressOrAbi)
      : JSON.parse(addressOrAbi);

    const methods = abi
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
