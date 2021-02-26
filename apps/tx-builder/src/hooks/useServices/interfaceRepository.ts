import axios from 'axios';
import memoize from 'lodash/memoize';
import { Networks } from '@gnosis.pm/safe-apps-sdk';

interface ContractMethod {
  inputs: any[];
  name: string;
  payable: boolean;
}

export interface ContractInterface {
  payableFallback: boolean;
  methods: ContractMethod[];
}

const getAbi = memoize(async (apiUrl: string) => axios.get(apiUrl));

const abiUrlGetterByNetwork: {
  [key in Networks]?: ((address: string) => string) | null;
} = {
  MAINNET: (address: string) => `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  MORDEN: null,
  RINKEBY: (address: string) => `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  ROPSTEN: null,
  GOERLI: null,
  KOVAN: null,
  XDAI: (address: string) => `https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=${address}`,
  ENERGY_WEB_CHAIN: (address: string) =>
    `https://explorer.energyweb.org/api?module=contract&action=getabi&address=${address}`,
  VOLTA: (address: string) =>
    `https://volta-explorer.energyweb.org/api?module=contract&action=getabi&address=${address}`,
  UNKNOWN: null,
};

class InterfaceRepository {
  network: Networks;
  web3: any;

  constructor(network: Networks, web3: any) {
    this.network = network;
    this.web3 = web3;
  }

  private async _loadAbiFromBlockExplorer(address: string): Promise<string> {
    const getAbiUrl = abiUrlGetterByNetwork[this.network];
    if (!getAbiUrl) {
      throw Error(`Network: ${this.network} not supported.`);
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
      .map((m: any) => {
        return {
          inputs: m.inputs || [],
          name: m.name || (m.type === 'fallback' ? 'fallback' : 'receive'),
          payable: this._isMethodPayable(m),
        };
      });

    const payableFallback = abi.findIndex((e: any) => e.type === 'fallback' && this._isMethodPayable(e)) >= 0;

    return { payableFallback, methods };
  }
}

export type InterfaceRepo = InstanceType<typeof InterfaceRepository>;

export default InterfaceRepository;
