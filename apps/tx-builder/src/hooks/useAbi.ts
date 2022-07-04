import { useEffect, useState } from 'react'
import { FETCH_STATUS, isValidAddress } from '../utils'
import { useNetwork } from '../store'

const useAbi = (address: string) => {
  const [abi, setAbi] = useState('')
  const { interfaceRepo } = useNetwork()
  const [abiStatus, setAbiStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)

  useEffect(() => {
    const loadContract = async (address: string) => {
      if (!isValidAddress(address) || !interfaceRepo || abi) {
        return
      }

      setAbiStatus(FETCH_STATUS.LOADING)
      try {
        const abiResponse = await interfaceRepo.loadAbi(address)

        if (abiResponse) {
          setAbi(JSON.stringify(abiResponse))
          setAbiStatus(FETCH_STATUS.SUCCESS)
        }
      } catch (e) {
        setAbiStatus(FETCH_STATUS.ERROR)
        console.error(e)
      }
    }

    loadContract(address)
  }, [abi, address, interfaceRepo])

  return { abi, abiStatus, setAbi }
}

export { useAbi }
