import { ChainInfo } from '@safe-global/safe-apps-sdk'
import { RampInstantEvent, RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const RINKEBY_STAGING_URL = 'https://ri-widget-staging.firebaseapp.com/'
const WIDGET_CLOSE_EVENT = 'WIDGET_CLOSE'
const PURCHASE_CREATED_EVENT = 'PURCHASE_CREATED'

export const ASSETS_BY_CHAIN: { [key: string]: string } = {
  '1': 'ETH_*,ERC20_*',
  '4': 'ETH_*,ERC20_*',
  '56': 'BSC_*',
  '137': 'MATIC_*',
  '100': 'XDAI_*',
  '43114': 'AVAX_*',
}

export const getRampWidgetUrl = (chainInfo: ChainInfo) => {
  return chainInfo?.chainId === '4' ? RINKEBY_STAGING_URL : ''
}

type RampWidgetInitializer = {
  url?: string
  assets: string
  address: string
  onClose?: () => void
}

export const initializeRampWidget = ({ url, assets, address, onClose }: RampWidgetInitializer) => {
  return new RampInstantSDK({
    url,
    hostAppName: 'Ramp Network Safe App',
    hostLogoUrl: 'https://docs.ramp.network/img/logo-1.svg',
    swapAsset: assets,
    userAddress: address,
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
