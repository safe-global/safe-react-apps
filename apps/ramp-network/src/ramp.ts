import { RampInstantEvent, RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { RAMP_API_KEY } from './constants'

const WIDGET_CLOSE_EVENT = 'WIDGET_CLOSE'
const PURCHASE_CREATED_EVENT = 'PURCHASE_CREATED'

export const ASSETS_BY_CHAIN: { [key: string]: string } = {
  '1': 'ETH_*',
  '10': 'OPTIMISM_*',
  '56': 'BSC_*',
  '137': 'MATIC_*',
  '100': 'XDAI_*',
  '43114': 'AVAX_*',
  '8453': 'BASE_*',
  '324': 'ZKSYNCERA_*',
  '1101': 'POLYGONZKEVM_*',
  '42161': 'ARBITRUM_*',
  '42220': 'CELO_*',
  '59144': 'LINEA_*',
}

type RampWidgetInitializer = {
  assets: string
  address: string
  onClose?: () => void
}

export const initializeRampWidget = ({ assets, address, onClose }: RampWidgetInitializer) => {
  return new RampInstantSDK({
    hostAppName: 'Ramp Network Safe App',
    hostLogoUrl: 'https://docs.ramp.network/img/logo-1.svg',
    swapAsset: assets,
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
