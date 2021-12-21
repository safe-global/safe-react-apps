import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import ComptrollerABI from '../abis/Comptroller';

export default function useComptroller(safeAddress: string, web3Instance: Web3 | undefined) {
  const { sdk } = useSafeAppsSDK();
  const [comptrollerInstance, setComptrollerInstance] = useState<any>();
  const [compAccrued, setCompAccrued] = useState<any>();
  const [compAddress, setCompAddress] = useState<any>();

  useEffect(() => {
    if (web3Instance) {
      setComptrollerInstance(
        new web3Instance.eth.Contract(ComptrollerABI as AbiItem[], '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b'),
      );
    }
  }, [web3Instance]);

  useEffect(() => {
    (async () => {
      if (!safeAddress) {
        return;
      }

      const [accrued, address] = await Promise.all([
        comptrollerInstance?.methods?.compAccrued(safeAddress).call(),
        comptrollerInstance?.methods?.getCompAddress().call(),
      ]);

      setCompAccrued(accrued);
      setCompAddress(address);
    })();
  }, [comptrollerInstance, safeAddress]);

  const claimComp = async () => {
    const txs = [
      {
        to: safeAddress,
        value: '0',
        data: comptrollerInstance.methods.claimComp(safeAddress).encodeABI(),
      },
    ];

    sdk.txs.send({ txs });
  };

  return {
    compAccrued,
    claimComp,
  };
}
