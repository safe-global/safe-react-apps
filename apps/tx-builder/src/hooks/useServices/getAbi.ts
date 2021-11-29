import axios from 'axios';
import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';

enum PROVIDER {
  SOURCIFY = 1,
  TX_SERVICE = 2,
}

type SourcifyResponse = {
  name: string;
  path: string;
  content: string;
};

const METADATA_FILE = 'metadata.json';

const getProviderURL = (chain: string, address: string, urlProvider: PROVIDER): string => {
  switch (urlProvider) {
    case PROVIDER.SOURCIFY:
      return `https://sourcify.dev/server/files/${chain}/${address}`;
    case PROVIDER.TX_SERVICE:
      return `https://safe-transaction.${chain}.gnosis.io/api/v1/contracts/${address}`;
    default:
      throw new Error('The Provider is not supported');
  }
};

const getAbiFromSourcify = async (address: string, chainId: string): Promise<any> => {
  const { data } = await axios.get<SourcifyResponse[]>(getProviderURL(chainId, address, PROVIDER.SOURCIFY));

  if (data.length) {
    const metadata = data.find((item: SourcifyResponse) => item.name === METADATA_FILE);
    return metadata && JSON.parse(metadata.content)?.output?.abi;
  }

  throw new Error('No ABI found using Sourcify');
};

const getAbiFromTxService = async (address: string, chainName: string): Promise<any> => {
  const { data } = await axios.get(getProviderURL(chainName, address, PROVIDER.TX_SERVICE));

  if (data) {
    return data?.contractAbi?.abi;
  }

  throw new Error('No ABI found using the Transaction Service');
};

const getAbi = async (address: string, chainInfo: ChainInfo): Promise<any> => {
  try {
    return await getAbiFromSourcify(address, chainInfo.chainId);
  } catch {
    return await getAbiFromTxService(address, chainInfo.chainName?.toLowerCase());
  }
};

export default getAbi;
