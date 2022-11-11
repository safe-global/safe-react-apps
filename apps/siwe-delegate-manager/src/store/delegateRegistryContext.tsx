import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Contract, ethers } from 'ethers'

import delegateRegistryContractABI from 'src/assets/delegateRegistryContractABI'
import { useSafeWallet } from './safeWalletContext'
import { getSiWeSpaceId } from '../utils/siwe'

// The Delegate Registry is a smart contract that is deterministically deployed to this address
const DELEGATE_REGISTRY_CONTRACT_ADDRESS = '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446'

type delegateRegistryContextValue = {
  delegateRegistryContractAddress: string
  delegateRegistryContract?: Contract
  delegations: delegateType[]
  spaces: Set<string>
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
    id: string
    isLoading: boolean
  }
  delegate: string
}

const initialState = {
  delegateRegistryContractAddress: DELEGATE_REGISTRY_CONTRACT_ADDRESS,
  delegations: [],
  isDelegationsLoading: true,
  spaces: new Set<string>(),
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

  const [delegations, setDelegations] = useState<delegateType[]>([])
  const [spaces, setSpaces] = useState<Set<string>>(new Set())

  // delegate events
  const [delegateEvents, setDelegateEvents] = useState<delegateEvent[]>([])
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true)

  const { safe, provider } = useSafeWallet()

  const delegateRegistryContract = useMemo(() => {
    if (provider) {
      return new ethers.Contract(
        DELEGATE_REGISTRY_CONTRACT_ADDRESS,
        delegateRegistryContractABI,
        provider.getSigner(),
      )
    }
  }, [provider])

  // load delegations for each defined space
  useEffect(() => {
    if (delegateRegistryContract && !isEventsLoading) {
      const delegationsFromEvents: delegateType[] = []
      spaces.forEach(spaceId => {
        // since the events are sorted by block number, we can find the last event for each space
        const latestEvent = delegateEvents.find(event => event.space === spaceId)

        if (latestEvent && latestEvent.eventType === 'SetDelegate') {
          delegationsFromEvents.push({
            space: {
              id: spaceId,
              isLoading: false,
            },
            delegate: latestEvent.delegate,
          })
        }
      })

      setDelegations(delegationsFromEvents)
    }
  }, [delegateRegistryContract, isEventsLoading, spaces, safe, delegateEvents])

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
      const siweSpaceIds = new Set<string>()
      const [delegateEvents, clearDelegateEvents] = await Promise.all([
        // fetch SetDelegate Events
        delegateRegistryContract
          .queryFilter(
            filteredSetDelegateEvents, // events filtered by the current safe
            0, // fromBlock
            'latest', // toBlock
          )
          .then(events =>
            events.filter(event => {
              const [, spaceId, delegateAddress] = event.args || []
              if (!spaceId || !delegateAddress) return false

              const siweSpaceId = spaceId === getSiWeSpaceId(delegateAddress)
              if (siweSpaceId) siweSpaceIds.add(spaceId)

              return siweSpaceId
            }),
          ),
        // fetch ClearDelegate Events
        delegateRegistryContract
          .queryFilter(
            filteredClearDelegateEvents, // events filtered by the current safe
            0, // fromBlock
            'latest', // toBlock
          )
          .then(events =>
            events.filter(event => {
              const [, spaceId, delegateAddress] = event.args || []
              if (!spaceId || !delegateAddress) return false

              return spaceId === getSiWeSpaceId(delegateAddress)
            }),
          ),
      ])

      // spaces defined (needed for the Delegation Table)
      setSpaces(siweSpaceIds)

      // merge SetDelegate & ClearDelegate events and order them by blockNumber (descending)
      const allEvents = [...delegateEvents, ...clearDelegateEvents].sort((a, b) =>
        a.blockNumber > b.blockNumber ? -1 : 1,
      )

      setDelegateEvents(
        allEvents.map(({ transactionHash, blockHash, logIndex, event, args }) => ({
          EventId: `${transactionHash}-${blockHash}-${logIndex}`, // to uniquely identify an event tx-hash, block-hash & logindex
          transactionHash,
          eventType: event as delegateEventType,
          delegator: args?.delegator,
          space: args?.id,
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
      try {
        await delegateRegistryContract?.setDelegate(
          space, // id bytes32
          delegate, // delegate address
        )

        // set this space as Loading
        setDelegations(delegations => {
          const delegation = delegations.find(delegation => delegation.space.id === space)

          if (delegation) {
            delegation.space.isLoading = true
            return [...delegations]
          }

          // new space
          return [
            ...delegations,
            {
              space: {
                id: space,
                isLoading: true,
              },
              delegate,
            },
          ]
        })
      } catch (error: any) {
        const isSelfDelegationError = error?.reason?.includes("Can't delegate to self")

        if (isSelfDelegationError) {
          throw new Error("Can't delegate to self address")
        }

        const isAlreadyDelegatedError = error?.reason?.includes('Already delegated to this address')

        if (isAlreadyDelegatedError) {
          throw new Error('Already delegated to this address')
        }

        throw error
      }
    },
    [delegateRegistryContract],
  )

  const clearDelegate = useCallback(
    async (space: string) => {
      await delegateRegistryContract?.clearDelegate(
        space, // id bytes32
      )

      // set this space as Loading
      setDelegations(delegations => {
        const delegation = delegations.find(delegation => delegation.space.id === space)

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
