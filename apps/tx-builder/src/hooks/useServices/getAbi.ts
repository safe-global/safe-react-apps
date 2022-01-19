import axios from 'axios';
import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';

enum PROVIDER {
  SOURCIFY = 1,
  GATEWAY = 2,
}

type SourcifyResponse = {
  name: string;
  path: string;
  content: string;
};

const METADATA_FILE = 'metadata.json';
const DEFAULT_TIMEOUT = 10000;

const getProviderURL = (chain: string, address: string, urlProvider: PROVIDER): string => {
  switch (urlProvider) {
    case PROVIDER.SOURCIFY:
      return `https://sourcify.dev/server/files/${chain}/${address}`;
    case PROVIDER.GATEWAY:
      return `https://safe-client.gnosis.io/v1/chains/${chain}/contracts/${address}`;
    default:
      throw new Error('The Provider is not supported');
  }
};

const getAbiFromSourcify = async (address: string, chainId: string): Promise<any> => {
  const { data } = await axios.get<SourcifyResponse[]>(getProviderURL(chainId, address, PROVIDER.SOURCIFY), {
    timeout: DEFAULT_TIMEOUT,
  });

  if (data.length) {
    const metadata = data.find((item: SourcifyResponse) => item.name === METADATA_FILE);
    return metadata && JSON.parse(metadata.content)?.output?.abi;
  }

  throw new Error('Contract found but could not found abi using Sourcify');
};

const getAbiFromGateway = async (address: string, chainName: string): Promise<any> => {
  const { data } = await axios.get(getProviderURL(chainName, address, PROVIDER.GATEWAY), {
    timeout: DEFAULT_TIMEOUT,
  });

  if (data) {
    return data?.contractAbi?.abi;
  }

  throw new Error('Contract found but could not found ABI using the Gateway');
};

const getAbi = async (address: string, chainInfo: ChainInfo): Promise<any> => {
  try {
    return await getAbiFromSourcify(address, chainInfo.chainId);
  } catch {
    return await getAbiFromGateway(address, chainInfo.chainId);
  }
};

export default getAbi;
