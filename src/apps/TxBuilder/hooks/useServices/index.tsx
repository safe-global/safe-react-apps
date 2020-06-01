import Web3 from "web3";
import InterfaceRepository from "./interfaceRepository";
import { useSafe } from "../useSafe";

import { InterfaceRepo } from "./interfaceRepository";

export interface Services {
  web3: any;
  interfaceRepo: InterfaceRepo;
}

export default function useServices(): Services {
  const safe = useSafe();

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      process.env.REACT_APP_WEB3_PROVIDER_URL as string
    )
  );

  const interfaceRepo = new InterfaceRepository(safe, web3);

  return {
    web3,
    interfaceRepo,
  };
}
