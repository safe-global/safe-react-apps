import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Title, Loader } from '@gnosis.pm/safe-react-components';
import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';
import RampWidget from './RampWidget';

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ASSETS_BY_CHAIN: { [key: string]: string } = {
  '1': 'ETH_*,ERC20_*',
  '4': 'ETH_*,ERC20_*',
  '56': 'BSC_*',
  '100': 'XDAI_*',
  '137': 'MATIC_*',
  '43114': 'AVAX_*',
};

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK();
  const [chainInfo, setChainInfo] = useState<ChainInfo>();

  useEffect(() => {
    (async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo();
        setChainInfo(chainInfo);
      } catch (e) {
        console.error('Unable to get chain info:', e);
      }
    })();
  }, [sdk]);

  const isChainSupported = useMemo(() => {
    return chainInfo && Object.keys(ASSETS_BY_CHAIN).includes(chainInfo.chainId);
  }, [chainInfo]);

  const getRampWidgetUrl = () => {
    return chainInfo?.chainId === '4' ? 'https://ri-widget-staging.firebaseapp.com/' : '';
  };

  if (!chainInfo) {
    return <Loader size="lg" />;
  }

  return (
    <Container>
      {!isChainSupported && <Title size="lg">Network not supported</Title>}
      {isChainSupported && (
        <RampWidget url={getRampWidgetUrl()} address={safe.safeAddress} assets={ASSETS_BY_CHAIN[chainInfo.chainId]} />
      )}
    </Container>
  );
};

export default SafeApp;
