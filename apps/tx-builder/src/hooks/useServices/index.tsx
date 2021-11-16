import { useState, useEffect } from 'react';
import Web3 from 'web3';

import InterfaceRepository from './interfaceRepository';
import { InterfaceRepo } from './interfaceRepository';
import { CHAINS, rpcUrlGetterByNetwork, shortNamesByNetwork, SHORT_NAMES } from '../../utils';

export interface Services {
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
  networkPrefix: SHORT_NAMES | undefined;
}

export default function useServices(chainId: CHAINS): Services {
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    const rpcUrlGetter = rpcUrlGetterByNetwork[chainId];
    if (!rpcUrlGetter) {
      throw Error(`RPC URL not defined for chain id ${chainId}`);
    }
    const rpcUrl = rpcUrlGetter(process.env.REACT_APP_RPC_TOKEN);

    const web3Instance = new Web3(rpcUrl);
    const interfaceRepo = new InterfaceRepository(chainId, web3Instance);

    setWeb3(web3Instance);
    setInterfaceRepo(interfaceRepo);
  }, [chainId]);

  const networkPrefix = shortNamesByNetwork[chainId];

  return {
    web3,
    interfaceRepo,
    networkPrefix,
  };
}
