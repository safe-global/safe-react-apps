import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { useEffect, useState } from 'react';
import { AbiItem } from 'web3-utils';
import ComptrollerABI from '../abis/Comptroller';
import { TokenItem } from '../config';
import useCToken from './useCToken';
import usePriceFeed from './usePriceFeed';
import useWeb3 from './useWeb3';

export default function useComptroller(safeAddress: string, selectedToken: TokenItem | undefined) {
  const { sdk } = useSafeAppsSDK();
  const { web3 } = useWeb3();
  const [comptrollerInstance, setComptrollerInstance] = useState<any>();
  const [compAccrued, setCompAccrued] = useState<any>();
  const [comptrollerAddress, setComptrollerAddress] = useState<any>();
  const [cTokenSupplyAPY, setCTokenSupplyAPY] = useState('0');
  const [cDistributionTokenSupplyAPY, setCDistributionTokenSupplyAPY] = useState('0');
  const { opfInstance } = usePriceFeed();
  const { cTokenInstance, tokenInstance } = useCToken(selectedToken);

  useEffect(() => {
    if (!selectedToken || !web3 || !cTokenInstance) {
      return;
    }

    (async () => {
      const address = await cTokenInstance.methods.comptroller().call();
      setComptrollerAddress(address);
    })();
  }, [cTokenInstance, selectedToken, web3]);

  useEffect(() => {
    if (!selectedToken || !web3 || !comptrollerAddress) {
      return;
    }

    (async () => {
      setComptrollerInstance(new web3.eth.Contract(ComptrollerABI as AbiItem[], comptrollerAddress));
    })();
  }, [selectedToken, web3, comptrollerAddress]);

  useEffect(() => {
    (async () => {
      if (!safeAddress || !comptrollerInstance) {
        return;
      }

      const accrued = await comptrollerInstance?.methods?.compAccrued(safeAddress).call();

      setCompAccrued(accrued);
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

  useEffect(() => {
    if (!cTokenInstance || !comptrollerInstance || !opfInstance || !selectedToken || !tokenInstance) {
      return;
    }

    // wait until cToken is correctly updated
    if (selectedToken.cTokenAddr.toLocaleLowerCase() !== cTokenInstance?._address.toLocaleLowerCase()) {
      return;
    }

    // wait until token is correctly updated
    if (selectedToken.tokenAddr.toLocaleLowerCase() !== tokenInstance?._address.toLocaleLowerCase()) {
      return;
    }

    console.log(selectedToken);
    const ethMantissa = 1e18;
    const blocksPerDay = 6570; // 13.15 seconds per block
    const daysPerYear = 365;

    // Calculate Supply APY
    (async () => {
      const supplyRatePerBlock = await cTokenInstance.methods.supplyRatePerBlock().call();
      const supplyApy = (Math.pow((supplyRatePerBlock / ethMantissa) * blocksPerDay + 1, daysPerYear) - 1) * 100;
      setCTokenSupplyAPY((Math.round(supplyApy * 100) / 100).toString());
    })();

    // Calculate Distribution APY
    (async () => {
      let compSpeedSupply = await comptrollerInstance?.methods?.compSupplySpeeds(selectedToken.cTokenAddr).call();
      let compPrice = await opfInstance?.methods?.price('COMP').call();
      let assetPrice = await opfInstance?.methods?.price(selectedToken.id).call();
      let totalSupply = await cTokenInstance?.methods?.totalSupply().call();
      let exchangeRate = await cTokenInstance?.methods?.exchangeRateCurrent().call();

      // Total supply needs to be converted from cTokens
      const apxBlockSpeedInSeconds = 13.15;
      exchangeRate = +exchangeRate.toString() / Math.pow(10, selectedToken.decimals);

      compSpeedSupply = compSpeedSupply / 1e18; // COMP has 18 decimal places
      compPrice = compPrice / 1e6; // price feed is USD price with 6 decimal places
      assetPrice = assetPrice / 1e6;
      totalSupply = (+totalSupply.toString() * exchangeRate) / Math.pow(10, 18);

      console.log('compSpeedSupply:', compSpeedSupply);
      console.log('compPrice:', compPrice);
      console.log('assetPrice:', assetPrice);
      console.log('totalSupply:', totalSupply);
      console.log('exchangeRate:', exchangeRate);

      const compPerDaySupply = compSpeedSupply * ((60 * 60 * 24) / apxBlockSpeedInSeconds);

      const compSupplyApy = 100 * (Math.pow(1 + (compPrice * compPerDaySupply) / (totalSupply * assetPrice), 365) - 1);

      setCDistributionTokenSupplyAPY((Math.round(compSupplyApy * 100) / 100).toString());
    })();
  }, [cTokenInstance, comptrollerInstance, opfInstance, selectedToken, tokenInstance]);

  return {
    comptrollerInstance,
    compAccrued,
    claimComp,
    cTokenSupplyAPY,
    cDistributionTokenSupplyAPY,
  };
}
