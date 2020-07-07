import axios from "axios";
import memoize from "lodash/memoize";

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

// rinkeby
//const apiUrl = "https://safe-transaction.staging.gnosisdev.com/api/v1";
const apiUrl = "https://safe-transaction.mainnet.gnosis.io/api/v1/";

export const getSafes = memoize(
  async (address: string): Promise<string[]> => {
    const res = await axios.get<{ safes: string[] }>(
      `${apiUrl}/owners/${address}/`
    );
    return res.data.safes;
  }
);

export const getBalances = memoize(
  async (safe: string): Promise<BalanceInfo[]> => {
    const res = await axios.get<BalanceInfo[]>(
      `${apiUrl}/safes/${safe}/balances/usd/`
    );

    return res.data.filter((b) => b.token !== null);
  }
);
