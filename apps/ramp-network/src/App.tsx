import React, { useEffect, useState, useMemo } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Title, Loader } from '@gnosis.pm/safe-react-components';
import { ChainInfo } from '@gnosis.pm/safe-apps-sdk';
import RampWidget from './components/RampWidget';
import { ASSETS_BY_CHAIN, getRampWidgetUrl } from './components/rampWidgetConfig';
import { goBack } from './utils';
import { Container } from './styles';

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

  if (!chainInfo) {
    return <Loader size="lg" />;
  }

  return (
    <Container>
      {!isChainSupported && <Title size="lg">Network not supported</Title>}
      {isChainSupported && (
        <RampWidget
          url={getRampWidgetUrl(chainInfo)}
          address={safe.safeAddress}
          assets={ASSETS_BY_CHAIN[chainInfo.chainId]}
          onClose={goBack}
        />
      )}
    </Container>
  );
};

export default SafeApp;
