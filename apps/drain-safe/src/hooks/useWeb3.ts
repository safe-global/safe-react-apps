import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'

function useWeb3() {
  const [web3, setWeb3] = useState<Web3 | undefined>()
  const { safe, sdk } = useSafeAppsSDK()

  useEffect(() => {
    const safeProvider = new SafeAppProvider(safe, sdk)
    // @ts-expect-error Web3 is complaining about some missing properties from websocket provider
    const web3Instance = new Web3(safeProvider)

    setWeb3(web3Instance)
  }, [safe, sdk])

  return {
    web3,
  }
}

export default useWeb3
