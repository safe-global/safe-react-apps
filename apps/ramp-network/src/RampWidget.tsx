import { useRef, useEffect } from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

type Props = {
  url?: string;
  assets: string;
  address: string;
  onClose?: () => void;
};

const WIDGET_CLOSE_EVENT = 'WIDGET_CLOSE';

const RampWidget = ({ url, assets, address, onClose }: Props) => {
  const containerNode = useRef(null);

  useEffect(() => {
    new RampInstantSDK({
      url,
      hostAppName: 'Ramp Network Safe App',
      hostLogoUrl: 'https://docs.ramp.network/img/logo-1.svg',
      swapAsset: assets,
      userAddress: address,
      containerNode: containerNode.current || undefined,
    })
      .on('*', (event) => {
        if (event.type === WIDGET_CLOSE_EVENT) {
          onClose?.();
        }
      })
      .show();
  }, []);

  return <div id="ramp-widget-container"></div>;
};

export default RampWidget;
