import axios from 'axios';
import memoize from 'lodash/memoize';

import { CHAINS } from '../../utils';

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
  [key in CHAINS]?: ((address: string) => string) | null;
} = {
  [CHAINS.MAINNET]: (address: string) => `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.MORDEN]: null,
  [CHAINS.ROPSTEN]: null,
  [CHAINS.RINKEBY]: (address: string) => `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.GOERLI]: null,
  [CHAINS.OPTIMISM]: (address: string) => `https://api-optimistic.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.KOVAN]: null,
  [CHAINS.BSC]: (address: string) => `https://api.bscscan.com/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.XDAI]: (address: string) => `https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.POLYGON]: (address: string) =>
    `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.ENERGY_WEB_CHAIN]: (address: string) =>
    `https://explorer.energyweb.org/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.ARBITRUM]: (address: string) =>
    `https://api.arbiscan.io/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.AVALANCHE]: (address: string) =>
  `https://api.snowtrace.io/api?module=contract&action=getabi&address=${address}`,
  [CHAINS.VOLTA]: (address: string) => 
    `https://volta-explorer.energyweb.org/api?module=contract&action=getabi&address=${address}`,
};

class InterfaceRepository {
  chainId: CHAINS;
  web3: any;

  constructor(chainId: CHAINS, web3: any) {
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
