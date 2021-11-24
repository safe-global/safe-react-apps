import axios from 'axios';
import { CHAINS } from '../../utils';

const NETWORKS = {
  [CHAINS.MAINNET]: 'mainnet',
  [CHAINS.RINKEBY]: 'rinkeby',
  [CHAINS.GOERLI]: 'goerli',
  [CHAINS.KOVAN]: 'kovan',
  [CHAINS.BSC]: 'bsc',
  [CHAINS.XDAI]: 'xdai',
  [CHAINS.POLYGON]: 'polygon',
  [CHAINS.ARBITRUM]: 'arbitrum',
  [CHAINS.VOLTA]: 'volta',
};

const getAbi = async (address, chainId) => {
  if (!NETWORKS[chainId]) {
    throw new Error('Chain not supported');
  }

  try {
    const { data: { contractAbi: { abi } } = {} } = await axios.get(
      `https://safe-transaction.${NETWORKS[chainId]}.gnosis.io/api/v1/contracts/${address}`,
    );

    return abi;
  } catch (error) {
    throw new Error(error);
  }
};

export default getAbi;
