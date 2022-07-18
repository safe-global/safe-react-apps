import { useCallback, useEffect, useState } from 'react'

import { isValidAddress } from '../utils'
import useModal from './useModal/useModal'

const useProxyDetection = (address: string, abi: string) => {
  const [implementationAddress, setImplementationAddress] = useState('')
  const [implementationAbi, setImplementationAbi] = useState('')

  const {
    open: showProxyModal,
    openModal: openProxyModal,
    closeModal: closeProxyModal,
  } = useModal()

  // TODO: implement detectProxyTarget logic and remove hardcoded data
  const detectProxyAbi = useCallback(
    async (address: string) => {
      // const implementationAddress = await detectProxyTarget(address)
      const implementationAddress = '0x34cfac646f301356faa8b21e94227e3583fe3f5f'
      setImplementationAddress(implementationAddress)

      console.log('CALLING')

      if (!!implementationAddress) {
        openProxyModal()
      }
    },
    [openProxyModal],
  )

  useEffect(() => {
    if (
      isValidAddress(address) &&
      !!abi &&
      address?.toLowerCase() !== implementationAddress?.toLowerCase()
    ) {
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
