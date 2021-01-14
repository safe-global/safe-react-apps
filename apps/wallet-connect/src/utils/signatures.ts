import { Interface } from '@ethersproject/abi';

const ABI = ['function signMessage(bytes _data) external'];
const safeSigningInterface = new Interface(ABI);

const encodeSignMessageCall = (message: string) => {
  const encoded = safeSigningInterface.encodeFunctionData('signMessage', [message]);

  return encoded;
};

export { encodeSignMessageCall };
