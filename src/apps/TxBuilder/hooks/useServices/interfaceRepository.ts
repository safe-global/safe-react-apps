import axios from "axios";
import memoize from "lodash/memoize";

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

class InterfaceRepository {
  safe: Safe;
  web3: any;

  constructor(safe: Safe, web3: any) {
    this.safe = safe;
    this.web3 = web3;
  }

  private async _loadAbiFromEtherscan(address: string): Promise<string> {
    const host =
      this.safe.getSafeInfo().network === "rinkeby"
        ? "https://api-rinkeby.etherscan.io"
        : "https://api.etherscan.io";

    const apiUrl = `${host}/api?module=contract&action=getabi&address=${address}`;

    const contractInfo = await getContract(apiUrl);
    if (contractInfo.data.status !== "1")
      throw Error(
        `Request not successful: ${contractInfo.data.message}; ${contractInfo.data.result}`
      );
    return contractInfo.data.result;
  }

  async loadAbi(addressOrAbi: string): Promise<ContractInterface> {
    const abiString = this.web3.utils.isAddress(addressOrAbi)
      ? await this._loadAbiFromEtherscan(addressOrAbi)
      : addressOrAbi;

    const abi = JSON.parse(abiString);

    const methods = abi
      .filter((e: any) => e.constant === false)
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
