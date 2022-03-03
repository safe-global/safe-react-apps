import { useState, useEffect } from 'react';
import Web3 from 'web3';
import SafeAppsSDK, { ChainInfo, SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

import InterfaceRepository from './interfaceRepository';
import { InterfaceRepo } from './interfaceRepository';
import { CHAINS, rpcUrlGetterByNetwork } from '../../utils';

export interface Services {
  sdk: SafeAppsSDK;
  safe: SafeInfo;
  chainInfo: ChainInfo | undefined;
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
}

export default function useServices(): Services {
  const { sdk, safe } = useSafeAppsSDK();
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [chainInfo, setChainInfo] = useState<ChainInfo>();
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();

  useEffect(() => {
    if (!chainInfo) {
      return;
    }

    const rpcUrlGetter = rpcUrlGetterByNetwork[chainInfo.chainId as CHAINS];
    if (!rpcUrlGetter) {
      throw Error(`RPC URL not defined for chain id ${chainInfo.chainId}`);
    }
    const rpcUrl = rpcUrlGetter(process.env.REACT_APP_RPC_TOKEN);

    const web3Instance = new Web3(rpcUrl);
    const interfaceRepo = new InterfaceRepository(chainInfo);

    setWeb3(web3Instance);
    setInterfaceRepo(interfaceRepo);
  }, [chainInfo]);

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo();
        setChainInfo(chainInfo);
      } catch (error) {
        console.error('Unable to get chain info:', error);
      }
    };

    getChainInfo();
  }, [sdk.safe]);

  return {
    sdk,
    safe,
    chainInfo,
    web3,
    interfaceRepo,
  };
}
