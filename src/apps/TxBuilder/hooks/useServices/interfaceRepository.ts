import axios from "axios";
import memoize from "lodash/memoize";
import { LowercaseNetworks } from "@gnosis.pm/safe-apps-sdk";

import { Safe } from "../../providers/SafeProvider/safeConnector";
interface ContractMethod {
  inputs: any[];
  name: string;
  payable: boolean;
}

export interface ContractInterface {
  payableFallback: boolean;
  methods: ContractMethod[];
}

const getContract = memoize(async (apiUrl: string) => axios.get(apiUrl));

const getAbiUrlByNetwork: {
  [key in LowercaseNetworks]?: ((address: string) => string) | null;
} = {
  mainnet: (address: string) =>
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  morden: null,
  rinkeby: (address: string) =>
    `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  ropsten: null,
  goerli: null,
  kovan: null,
  xdai: (address: string) =>
    `https://blockscout.com/poa/xdai/api?module=contract&action=getabi&address=${address}`,
  energy_web_chain: null,
  volta: null,
  unknown: null,
};

class InterfaceRepository {
  safe: Safe;
  web3: any;

  constructor(safe: Safe, web3: any) {
    this.safe = safe;
    this.web3 = web3;
  }

  private async _loadAbiFromEtherscan(address: string): Promise<string> {
    const abiUrl = getAbiUrlByNetwork[this.safe.getSafeInfo().network];
    if (!abiUrl) {
      throw Error(`Network: ${this.safe.getSafeInfo().network} not supported.`);
    }

    const contractInfo = await getContract(abiUrl(address));
    if (contractInfo.data.status !== "1")
      throw Error(
        `Request not successful: ${contractInfo.data.message}; ${contractInfo.data.result}.`
      );
    return contractInfo.data.result;
  }

  async loadAbi(addressOrAbi: string): Promise<ContractInterface> {
    const abiString = this.web3.utils.isAddress(addressOrAbi)
      ? await this._loadAbiFromEtherscan(addressOrAbi)
      : addressOrAbi;

    const abi = JSON.parse(abiString);

    const methods = abi
      .filter((e: any) => {
        if (["pure", "view"].includes(e.stateMutability)) {
          return false;
        }

        return !e.constant;
      })
      .map((m: any) => {
        return { inputs: m.inputs, name: m.name, payable: m.payable || false };
      });

    const payableFallback =
      abi.findIndex((e: any) => e.type === "fallback" && e.payable === true) >=
      0;

    return { payableFallback, methods };
  }
}

export type InterfaceRepo = InstanceType<typeof InterfaceRepository>;

export default InterfaceRepository;
