// https://compound.finance/docs/prices
import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import useWeb3 from './useWeb3'
import UniSwapAnchoredViewABI from '../abis/UniSwapAnchoredViewABI'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

export default function useOpenPriceFeed() {
  const { safe } = useSafeAppsSDK()
  const [opfInstance, setOpfInstance] = useState<Contract>()
  const { web3 } = useWeb3()

  useEffect(() => {
    if (!web3 || !safe) {
      return
    }

    setOpfInstance(
      new web3.eth.Contract(
        UniSwapAnchoredViewABI as AbiItem[],
        OPEN_PRICE_FEED_CONTRACT[safe.chainId],
      ),
    )
  }, [web3, safe])

  return {
    opfInstance,
  }
}

const OPEN_PRICE_FEED_CONTRACT: { [key: number]: string } = {
  1: '0x046728da7cb8272284238bd3e47909823d63a58d',
  4: '0x01f590Fc7399A71BbD4cF15538FF82b2133AEbb6',
}
