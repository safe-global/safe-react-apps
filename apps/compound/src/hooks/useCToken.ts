import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import CErc20ABI from '../abis/CErc20'
import CWethABI from '../abis/CWEth'
import { TokenItem } from '../config'
import useWeb3 from './useWeb3'

export default function useCToken(selectedToken: TokenItem | undefined) {
  const { web3 } = useWeb3()
  const [cTokenInstance, setCTokenInstance] = useState<Contract>()
  const [tokenInstance, setTokenInstance] = useState<Contract>()

  useEffect(() => {
    if (!selectedToken || !web3) {
      return
    }

    setTokenInstance(new web3.eth.Contract(CErc20ABI as AbiItem[], selectedToken.tokenAddr))

    if (selectedToken.id === 'ETH') {
      setCTokenInstance(new web3.eth.Contract(CWethABI as AbiItem[], selectedToken.cTokenAddr))
    } else {
      setCTokenInstance(new web3.eth.Contract(CErc20ABI as AbiItem[], selectedToken.cTokenAddr))
    }
  }, [selectedToken, web3])

  return {
    cTokenInstance,
    tokenInstance,
  }
}
