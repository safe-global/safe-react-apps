import { ChainInfo } from '@safe-global/safe-apps-sdk'
import { RampInstantEvent, RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { RAMP_API_KEY } from './constants'

const RINKEBY_STAGING_URL = 'https://ri-widget-staging.firebaseapp.com/'
const WIDGET_CLOSE_EVENT = 'WIDGET_CLOSE'
const PURCHASE_CREATED_EVENT = 'PURCHASE_CREATED'

export const getRampWidgetUrl = (chainInfo: ChainInfo) => {
  return chainInfo?.chainId === '4' ? RINKEBY_STAGING_URL : ''
}

type RampWidgetInitializer = {
  address: string
  onClose?: () => void
}

export const initializeRampWidget = ({ address, onClose }: RampWidgetInitializer) => {
  return new RampInstantSDK({
    hostAppName: 'Ramp Network Safe App',
    hostLogoUrl: 'https://docs.ramp.network/img/logo-1.svg',
    userAddress: address,
    hostApiKey: RAMP_API_KEY,
  })
    .on('*', (event: RampInstantEvent) => {
      if (event.type === WIDGET_CLOSE_EVENT) {
        onClose?.()
      }

      if (event.type === PURCHASE_CREATED_EVENT) {
        // TODO: Send Analytics when the infra is ready
        // https://github.com/gnosis/safe-apps-sdk/issues/255
        console.log('PURCHASE_CREATED_EVENT', event)
      }
    })
    .show()
}
