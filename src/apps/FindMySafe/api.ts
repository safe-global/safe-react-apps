import axios from "axios";
import memoize from "lodash/memoize";

import { Networks } from "@gnosis.pm/safe-apps-sdk";

export type BalanceInfo = {
  tokenAddress: string;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
  };
  balance: string;
};

const apiNetwork: { [key in Networks]: string } = {
  rinkeby: "https://safe-transaction.staging.gnosisdev.com/api/v1",
  mainnet: "https://safe-transaction.mainnet.gnosis.io/api/v1/",
};

export const getSafes = memoize(
  async (address: string, network: Networks): Promise<string[]> => {
    const res = await axios.get<{ safes: string[] }>(
      `${apiNetwork[network]}/owners/${address}/`
    );
    return res.data.safes;
  }
);

export const getBalances = memoize(
  async (safe: string, network: Networks): Promise<BalanceInfo[]> => {
    const res = await axios.get<BalanceInfo[]>(
      `${apiNetwork[network]}/safes/${safe}/balances/usd/`
    );

    return res.data.filter((b) => b.token !== null);
  }
);
