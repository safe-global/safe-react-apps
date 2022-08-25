import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Contract, ethers } from 'ethers'
import { formatBytes32String, parseBytes32String } from 'ethers/lib/utils'

import delegateRegistryContractABI from 'src/assets/delegateRegistryContractABI'
import { useSafeWallet } from './safeWalletContext'

// The Delegate Registry is a smart contract that is deterministically deployed to this address
const DELEGATE_REGISTRY_CONTRACT_ADDRESS = '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446'

type delegateRegistryContextValue = {
  delegateRegistryContractAddress: string
  delegateRegistryContract?: Contract
  isContractLoading: boolean
  delegations: delegateType[]
  spaces: string[]
  setDelegate: (space: string, delegate: string) => Promise<void>
  clearDelegate: (space: string) => Promise<void>
  delegateEvents: delegateEvent[]
  isEventsLoading: boolean
}

type delegateEventType = 'SetDelegate' | 'ClearDelegate'

type delegateEvent = {
  EventId: string
  transactionHash: string
  eventType: delegateEventType
  delegator: string
  space: string
  delegate: string
}

type delegateType = {
  space: {
    name: string
    isLoading: boolean
  }
  delegate: string
}

const initialState = {
  delegateRegistryContractAddress: DELEGATE_REGISTRY_CONTRACT_ADDRESS,
  isContractLoading: true,
  delegations: [],
  spaces: [],
  delegateEvents: [],
  isEventsLoading: true,
  setDelegate: () => Promise.resolve(undefined),
  clearDelegate: () => Promise.resolve(undefined),
}

const delegateRegistryContext = createContext<delegateRegistryContextValue>(initialState)

const useDelegateRegistry = () => {
  const context = useContext(delegateRegistryContext)

  if (!context) {
    throw new Error(
      'useDelegateRegistry should be used within a Delegate Registry Context Provider',
    )
  }

  return context
}

const DelegateRegistryProvider = ({ children }: { children: JSX.Element }) => {
  const delegateRegistryContractAddress = DELEGATE_REGISTRY_CONTRACT_ADDRESS

  const [delegateRegistryContract, setDelegateRegistryContract] = useState<Contract>()
  const [isContractLoading, setIsContractLoading] = useState<boolean>(true)

  const [delegations, setDelegations] = useState<delegateType[]>([])
  const [spaces, setSpaces] = useState<string[]>([])

  // delegate events
  const [delegateEvents, setDelegateEvents] = useState<delegateEvent[]>([])
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true)

  const { safe, provider } = useSafeWallet()

  // load Delegate Registry contract
  useEffect(() => {
    if (provider && !delegateRegistryContract) {
      setIsContractLoading(true)

      const delegateRegistryContract = new ethers.Contract(
        DELEGATE_REGISTRY_CONTRACT_ADDRESS,
        delegateRegistryContractABI,
        provider.getSigner(),
      )

      setDelegateRegistryContract(delegateRegistryContract)
    }
  }, [delegateRegistryContract, provider])

  // load delegations for each defined space
  const getDelegations = useCallback(async () => {
    if (delegateRegistryContract && spaces && spaces.length > 0) {
      const delegations = await Promise.all(
        spaces.map(async space => {
          const delegate = await delegateRegistryContract.delegation(
            safe.safeAddress, // safe address
            formatBytes32String(space), // space
          )

          return {
            space: {
              name: space,
              isLoading: false,
            },
            delegate,
          }
        }),
      )

      setDelegations(delegations)
      setIsContractLoading(false)
    }
  }, [delegateRegistryContract, spaces, safe])

  useEffect(() => {
    getDelegations()
  }, [getDelegations])

  // fetch all events filtered by the current Safe address (SetDelegate & ClearDelegate events)
  const getEvents = useCallback(async () => {
    // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events

    if (delegateRegistryContract && safe && safe.safeAddress) {
      // SetDelegate Events
      const filteredSetDelegateEvents = delegateRegistryContract.filters.SetDelegate(
        safe.safeAddress, // delegator address
        null, // id bytes32
        null, // delegate address
      )
      // ClearDelegate Events
      const filteredClearDelegateEvents = delegateRegistryContract.filters.ClearDelegate(
        safe.safeAddress, // delegator address
        null, // id bytes32
        null, // delegate address
      )

      // fetch SetDelegate & ClearDelegate Events
      const [delegateEvents, clearDelegateEvents] = await Promise.all([
        // fetch SetDelegate Events
        delegateRegistryContract.queryFilter(
          filteredSetDelegateEvents, // events filterd by the current safe
          0, // fromBlock
          'latest', // toBlock
        ),
        // fetch ClearDelegate Events
        delegateRegistryContract.queryFilter(
          filteredClearDelegateEvents, // events filterd by the current safe
          0, // fromBlock
          'latest', // toBlock
        ),
      ])

      // spaces defined (needed for the Delegation Table)
      setSpaces(
        delegateEvents.reduce<string[]>((spaces, event) => {
          const newSpace = parseBytes32String(event.args?.id)

          const isSpaceAlreadyAdded = spaces.some(space => space === newSpace)

          if (isSpaceAlreadyAdded) {
            return spaces
          }

          return [...spaces, newSpace]
        }, []),
      )

      // merge SetDelegate & ClearDelegate events and order them by blockNumber
      const allEvents = [...delegateEvents, ...clearDelegateEvents].sort((a, b) =>
        a.blockNumber > b.blockNumber ? -1 : 1,
      )

      setDelegateEvents(
        allEvents.map(({ transactionHash, blockHash, logIndex, event, args }) => ({
          EventId: `${transactionHash}-${blockHash}-${logIndex}`, // to uniquely identify an event tx-hash, block-hash & logindex
          transactionHash,
          eventType: event as delegateEventType,
          delegator: args?.delegator,
          space: parseBytes32String(args?.id),
          delegate: args?.delegate,
        })),
      )

      setIsEventsLoading(false)
    }
  }, [safe, delegateRegistryContract])

  useEffect(() => {
    getEvents()
  }, [getEvents])

  // Subscribe to new events
  useEffect(() => {
    if (delegateRegistryContract && safe && safe.safeAddress) {
      // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events
      // SetDelegate Events
      const filteredSetDelegateEvents = delegateRegistryContract.filters.SetDelegate(
        safe.safeAddress, // delegator address
        null, // id bytes32
        null, // delegate address
      )
      // ClearDelegate Events
      const filteredClearDelegateEvents = delegateRegistryContract.filters.ClearDelegate(
        safe.safeAddress, // delegator address
        null, // id bytes32
        null, // delegate address
      )

      delegateRegistryContract.on(filteredSetDelegateEvents, () => {
        getEvents()
      })

      delegateRegistryContract.on(filteredClearDelegateEvents, () => {
        getEvents()
      })
    }
  }, [delegateRegistryContract, safe, getEvents])

  // remove all listeners if the contract changes
  useEffect(() => {
    return () => {
      delegateRegistryContract?.removeAllListeners()
    }
  }, [delegateRegistryContract])

  const setDelegate = useCallback(
    async (space: string, delegate: string) => {
      await delegateRegistryContract?.setDelegate(
        formatBytes32String(space), // id bytes32
        delegate, // delegate address
      )

      // set this space as Loading
      setDelegations(delegations => {
        const delegation = delegations.find(delegation => delegation.space.name === space)

        if (delegation) {
          delegation.space.isLoading = true
          return [...delegations]
        }

        // new space
        return [
          ...delegations,
          {
            space: {
              name: space,
              isLoading: true,
            },
            delegate,
          },
        ]
      })
    },
    [delegateRegistryContract],
  )

  const clearDelegate = useCallback(
    async (space: string) => {
      await delegateRegistryContract?.clearDelegate(
        formatBytes32String(space), // id bytes32
      )

      // set this space as Loading
      setDelegations(delegations => {
        const delegation = delegations.find(delegation => delegation.space.name === space)

        if (delegation) {
          delegation.space.isLoading = true
          return [...delegations]
        }
        return delegations
      })
    },
    [delegateRegistryContract],
  )

  const state = {
    delegateRegistryContractAddress,

    delegateRegistryContract,
    isContractLoading,

    delegations,
    spaces,

    setDelegate,
    clearDelegate,

    delegateEvents,
    isEventsLoading,
  }

  return (
    <delegateRegistryContext.Provider value={state}>{children}</delegateRegistryContext.Provider>
  )
}

export { useDelegateRegistry, DelegateRegistryProvider }
