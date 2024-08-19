import React, { useEffect, useState } from 'react'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { Loader } from '@gnosis.pm/safe-react-components'
import { ChainInfo } from '@safe-global/safe-apps-sdk'
import { goBack } from './utils'
import { initializeRampWidget } from './ramp'

const SafeApp = (): React.ReactElement | null => {
  const { sdk, safe } = useSafeAppsSDK()
  const [chainInfo, setChainInfo] = useState<ChainInfo>()

  useEffect(() => {
    ;(async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo()
        setChainInfo(chainInfo)
      } catch (e) {
        console.error('Unable to get chain info:', e)
      }
    })()
  }, [sdk])

  useEffect(() => {
    if (chainInfo && safe) {
      initializeRampWidget({
        address: safe.safeAddress,
        onClose: goBack,
      })
    }
  }, [chainInfo, safe])

  if (!chainInfo || !safe) {
    return <Loader size="lg" />
  }

  return null
}

export default SafeApp
