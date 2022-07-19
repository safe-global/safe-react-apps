import { useCallback, useEffect, useState } from 'react'
import detectProxyTarget from 'evm-proxy-detection'

import { isValidAddress } from '../utils'
import useModal from './useModal/useModal'
import { useNetwork } from '../store'

const useProxyDetection = (address: string, abi: string) => {
  const [implementationAddress, setImplementationAddress] = useState('')
  const [implementationAbi, setImplementationAbi] = useState('')

  const {
    open: showProxyModal,
    openModal: openProxyModal,
    closeModal: closeProxyModal,
  } = useModal()

  const { interfaceRepo, web3 } = useNetwork()

  const detectProxyAbi = useCallback(
    async (address: string) => {
      const implementationAddress = await detectProxyTarget(
        address,
        // @ts-expect-error currentProvider type is many providers and not all of them are compatible
        // with EIP-1193, but the one we use is compatible (safe-apps-provider)
        web3.currentProvider.request.bind(web3.currentProvider),
      )

      if (implementationAddress) {
        setImplementationAddress(implementationAddress)

        const abiResponse = await interfaceRepo?.loadAbi(implementationAddress)

        if (!!implementationAddress && abiResponse) {
          setImplementationAbi(JSON.stringify(abiResponse))
          openProxyModal()
        }
      }
    },
    [openProxyModal, interfaceRepo, web3],
  )

  useEffect(() => {
    setImplementationAddress('')
  }, [address])

  useEffect(() => {
    if (isValidAddress(address) && !!abi && !implementationAddress) {
      detectProxyAbi(address)
    }
  }, [address, abi, implementationAddress, detectProxyAbi])

  return {
    implementationAddress,
    implementationAbi,

    showProxyModal,
    closeProxyModal,
  }
}

export default useProxyDetection
