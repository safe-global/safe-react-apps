import { useRef, useEffect } from 'react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

type Props = {
  url?: string;
  assets: string;
  address: string;
  onClose?: () => void;
};

const WIDGET_CLOSE_EVENT = 'WIDGET_CLOSE';
const PURCHASE_CREATED_EVENT = 'PURCHASE_CREATED';

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
      .on('*', (event: any) => {
        if (event.type === WIDGET_CLOSE_EVENT) {
          onClose?.();
        }

        if (event.type === PURCHASE_CREATED_EVENT) {
          // TODO: Send Analytics when the infra is ready
          // https://github.com/gnosis/safe-apps-sdk/issues/255
          console.log('PURCHASE_CREATED_EVENT', event);
        }
      })
      .show();
    // eslint-disable-next-line
  }, []);

  return <div id="ramp-widget-container"></div>;
};

export default RampWidget;
