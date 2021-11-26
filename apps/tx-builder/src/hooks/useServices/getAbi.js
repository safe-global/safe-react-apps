import axios from 'axios';

const SOURCIFY_ENDPOINT = 'https://sourcify.dev/server';
const TRANSACTION_SERVICE_ENDPOINT = (address, chainId) =>
  `https://safe-transaction.${chainId}.gnosis.io/api/v1/contracts/${address}`;

const getAbiFromSourcify = async (address: string, chainId: string): string => {
  try {
    const data = await axios.post(SOURCIFY_ENDPOINT, { address, chainId });
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getAbiFromTxService = async (address: string, chainId: string): string => {
  try {
    const data = await axios.get(TRANSACTION_SERVICE_ENDPOINT(address, chainId));
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getAbi = async (address: string, chainId: string): string => {
  try {
    let abi = await getAbiFromSourcify(address, chainId);
    if (!abi) {
      abi = await getAbiFromTxService(address, chainId);
    }

    return abi;
  } catch (error) {
    return error;
  }
};

export default getAbi;
