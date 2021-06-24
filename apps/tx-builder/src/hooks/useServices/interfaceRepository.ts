import axios from 'axios';
import memoize from 'lodash/memoize';

interface ContractMethod {
  inputs: any[];
  name: string;
  payable: boolean;
}

export interface ContractInterface {
  methods: ContractMethod[];
}

const getAbi = memoize(async (apiUrl: string) => axios.get(apiUrl));

const abiUrlGetterByNetwork: {
  [key in number]?: ((address: string) => string) | null;
} = {
  1: (address: string) => `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  2: null,
  4: (address: string) => `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  3: null,
  5: null,
  42: null,
  100: (address: string) => `https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=${address}`,
  246: (address: string) =>
    `https://explorer.energyweb.org/api?module=contract&action=getabi&address=${address}`,
  73799: (address: string) =>
    `https://volta-explorer.energyweb.org/api?module=contract&action=getabi&address=${address}`,
  137: (address: string) =>
    `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}`,
};

class InterfaceRepository {
  chainId: number;
  web3: any;

  constructor(chainId: number, web3: any) {
    this.chainId = chainId;
    this.web3 = web3;
  }

  private async _loadAbiFromBlockExplorer(address: string): Promise<string> {
    const getAbiUrl = abiUrlGetterByNetwork[this.chainId];
    if (!getAbiUrl) {
      throw Error(`Chain id: ${this.chainId} not supported.`);
    }

    const abi = await getAbi(getAbiUrl(address));
    if (abi.data.status !== '1') throw Error(`Request not successful: ${abi.data.message}; ${abi.data.result}.`);
    return abi.data.result;
  }

  private _isMethodPayable = (m: any) => m.payable || m.stateMutability === 'payable';

  async loadAbi(addressOrAbi: string): Promise<ContractInterface> {
    const abiString = this.web3.utils.isAddress(addressOrAbi)
      ? await this._loadAbiFromBlockExplorer(addressOrAbi)
      : addressOrAbi;

    const abi = JSON.parse(abiString);

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
