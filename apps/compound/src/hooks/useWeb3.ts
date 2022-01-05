import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

function useWeb3(): { web3: Web3 | undefined } {
  const [web3, setWeb3] = useState<Web3 | undefined>();

  const { sdk } = useSafeAppsSDK();

  useEffect(() => {
    const setWeb3Instance = async () => {
      const chainInfo = await sdk.safe.getChainInfo();

      if (!chainInfo) {
        return;
      }

      const rpcUrlGetter = rpcUrlGetterByNetwork[chainInfo.chainId as CHAINS];

      if (!rpcUrlGetter) {
        throw Error(`RPC URL not defined for ${chainInfo.chainName} chain`);
      }

      const rpcUrl = rpcUrlGetter(process.env.REACT_APP_RPC_TOKEN);

      const web3Instance = new Web3(rpcUrl);

      setWeb3(web3Instance);
    };

    setWeb3Instance();
  }, [sdk.safe]);

  return {
    web3,
  };
}

export default useWeb3;

export enum CHAINS {
  MAINNET = '1',
  RINKEBY = '4',
}

export const rpcUrlGetterByNetwork: {
  [key in CHAINS]: null | ((token?: string) => string);
} = {
  [CHAINS.MAINNET]: (token) => `https://mainnet.infura.io/v3/${token}`,
  [CHAINS.RINKEBY]: (token) => `https://rinkeby.infura.io/v3/${token}`,
};
