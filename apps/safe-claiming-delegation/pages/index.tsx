import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import type { NextPage } from 'next'

import { useWallet } from '@/hooks/useWallet'
import { ConnectWallet } from '@/components/ConnectWallet'
import { Intro } from '@/components/Intro'

const IndexPage: NextPage = () => {
  const sdk = useSafeAppsSDK()
  const wallet = useWallet()

  const isSafeApp = sdk.connected

  return !isSafeApp && !wallet ? <ConnectWallet /> : <Intro />
}

export default IndexPage
