import { useState, useEffect } from "react";
import Web3 from "web3";

import InterfaceRepository from "./interfaceRepository";
import { useSafe } from "../useSafe";
import { InterfaceRepo } from "./interfaceRepository";
import { rpcUrlGetterByNetwork } from "../../utils";

export interface Services {
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
}

export default function useServices(): Services {
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [interfaceRepo, setInterfaceRepo] = useState<
    InterfaceRepository | undefined
  >();
  const safe = useSafe();

  useEffect(() => {
    if (!safe.info) {
      return;
    }

    const rpcUrlGetter = rpcUrlGetterByNetwork[safe.info.network];
    if (!rpcUrlGetter) {
      throw Error(`RPC URL not defined for network ${safe.info.network}`);
    }
    const rpcUrl = rpcUrlGetter(process.env.REACT_APP_RPC_TOKEN);

    const web3Instance = new Web3(rpcUrl);
    const interfaceRepo = new InterfaceRepository(safe, web3Instance);

    setWeb3(web3Instance);
    setInterfaceRepo(interfaceRepo);
  }, [safe]);

  return {
    web3,
    interfaceRepo,
  };
}
