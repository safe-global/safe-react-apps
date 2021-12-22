import { useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import useWeb3 from './useWeb3';
import UniSwapAnchoredViewABI from '../abis/UniSwapAnchoredViewABI';

export default function usePriceFeed() {
  const [opfInstance, setOpfInstance] = useState<any>();
  const { web3 } = useWeb3();

  useEffect(() => {
    if (!web3) {
      return;
    }

    setOpfInstance(
      new web3.eth.Contract(UniSwapAnchoredViewABI as AbiItem[], '0x046728da7cb8272284238bd3e47909823d63a58d'),
    );
  }, [web3]);

  return {
    opfInstance,
  };
}
