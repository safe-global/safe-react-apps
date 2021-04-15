import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Networks } from '@gnosis.pm/safe-apps-sdk';

import InterfaceRepository from './interfaceRepository';
import { InterfaceRepo } from './interfaceRepository';
import { rpcUrlGetterByNetwork } from '../../utils';

export interface Services {
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
}

export default function useServices(network: Networks): Services {
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();

  useEffect(() => {
    if (!network) {
      return;
    }

    const rpcUrlGetter = rpcUrlGetterByNetwork[network];
    if (!rpcUrlGetter) {
      throw Error(`RPC URL not defined for network ${network}`);
    }
    const rpcUrl = rpcUrlGetter(process.env.REACT_APP_RPC_TOKEN);

    const web3Instance = new Web3(rpcUrl);
    const interfaceRepo = new InterfaceRepository(network, web3Instance);

    setWeb3(web3Instance);
    setInterfaceRepo(interfaceRepo);
  }, [network]);

  return {
    web3,
    interfaceRepo,
  };
}
