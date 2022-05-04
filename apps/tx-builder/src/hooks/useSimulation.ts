import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import { useCallback, useState, useMemo } from 'react'
import { TenderlySimulation } from '../lib/simulation/types'
import {
  getBlockMaxGasLimit,
  getSimulationPayload,
  getSimulation,
  getSimulationLink,
} from '../lib/simulation/simulation'
import { useNetwork } from '../store/networkContext'
import { FETCH_STATUS } from '../utils'

type UseSimulationReturn =
  | {
      simulationRequestStatus: FETCH_STATUS.NOT_ASKED | FETCH_STATUS.ERROR | FETCH_STATUS.LOADING
      simulation: undefined
      simulateTransaction: () => void
      simulationLink: string
    }
  | {
      simulationRequestStatus: FETCH_STATUS.SUCCESS
      simulation: TenderlySimulation
      simulateTransaction: () => void
      simulationLink: string
    }

const useSimulation = (transactions: BaseTransaction[]): UseSimulationReturn => {
  const [simulation, setSimulation] = useState<TenderlySimulation | undefined>()
  const [simulationRequestStatus, setSimulationRequestStatus] = useState<FETCH_STATUS>(
    FETCH_STATUS.NOT_ASKED,
  )
  const simulationLink = useMemo(
    () => getSimulationLink(simulation?.simulation.id || ''),
    [simulation],
  )
  const { safe, web3 } = useNetwork()

  const simulateTransaction = useCallback(async () => {
    if (!web3) return

    setSimulationRequestStatus(FETCH_STATUS.LOADING)
    try {
      const safeNonce = await web3.eth.getStorageAt(safe.safeAddress, `0x${'3'.padStart(64, '0')}`)
      const blockGasLimit = await getBlockMaxGasLimit(web3)

      const simulationPayload = getSimulationPayload({
        chainId: safe.chainId.toString(),
        safeAddress: safe.safeAddress,
        executionOwner: safe.owners[0],
        safeNonce,
        transactions,
        gasLimit: parseInt(blockGasLimit),
      })

      const simulationResponse = await getSimulation(simulationPayload)
      setSimulation(simulationResponse)
      setSimulationRequestStatus(FETCH_STATUS.SUCCESS)
    } catch (error) {
      console.error(error)
      setSimulationRequestStatus(FETCH_STATUS.ERROR)
    }
  }, [safe, transactions, web3])

  return {
    simulateTransaction,
    simulationRequestStatus,
    simulation,
    simulationLink,
  } as UseSimulationReturn
}

export { useSimulation }
