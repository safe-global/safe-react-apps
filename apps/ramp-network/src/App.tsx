import React, { useEffect, useState, useMemo } from 'react'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { Title, Loader, Text } from '@gnosis.pm/safe-react-components'
import { ChainInfo } from '@safe-global/safe-apps-sdk'
import { goBack } from './utils'
import { ASSETS_BY_CHAIN, initializeRampWidget } from './ramp'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30em;
`

const NetworkNotSupported = ({ name }: { name: string }): React.ReactElement => {
  return (
    <Container>
      <Title size="md">Network not supported</Title>
      <Text size="lg">Currently {name} is not supported</Text>
    </Container>
  )
}

const SafeApp = (): React.ReactElement | null => {
  const { sdk, safe } = useSafeAppsSDK()
  const [chainInfo, setChainInfo] = useState<ChainInfo>()

  const isChainSupported = useMemo(() => {
    return chainInfo && Object.keys(ASSETS_BY_CHAIN).includes(chainInfo.chainId)
  }, [chainInfo])

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
    if (chainInfo && safe && isChainSupported) {
      initializeRampWidget({
        address: safe.safeAddress,
        assets: ASSETS_BY_CHAIN[chainInfo.chainId],
        onClose: goBack,
      })
    }
  }, [chainInfo, safe, isChainSupported])

  if (!chainInfo || !safe) {
    return <Loader size="lg" />
  }

  if (!isChainSupported) {
    return <NetworkNotSupported name={chainInfo.chainName} />
  }

  return null
}

export default SafeApp
