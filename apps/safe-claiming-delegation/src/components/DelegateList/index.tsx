import { Button, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import { DelegateCard } from '@/components/DelegateCard'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { ExpandedDelegateCard } from '@/components/ExpandedDelegateCard'
import { NavButtons } from '@/components/NavButtons'
import { useDelegationStepper } from '@/components/Delegation'
import { useDelegate } from '@/hooks/useDelegate'
import { ScrollContextProvider, useScrollContext } from '@/components/ScrollContext'
import type { FileDelegate } from '@/hooks/useDelegatesFile'

const SLICE_SIZE = 6

const filterDelegates = (searchTerm: string, delegates: FileDelegate[]) => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase()

  return delegates.filter(delegate =>
    [delegate.address, delegate.ens, delegate.name].some(value =>
      value
        ?.toLowerCase()
        .split(' ')
        .some(str => str.startsWith(lowerCaseSearchTerm)),
    ),
  )
}

export const DelegateList = () => {
  return (
    <ScrollContextProvider>
      <ScrollProvidedList />
    </ScrollContextProvider>
  )
}

const ScrollProvidedList = () => {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [expandedDelegate, setExpandedDelegate] = useState<FileDelegate>()

  const { data: delegates = [] } = useDelegatesFile()
  const delegate = useDelegate()

  const { storeScrollPosition, restoreScrollPosition } = useScrollContext()

  const { stepperState, setStepperState, onNext } = useDelegationStepper()
  const selectedSafeGuardian = stepperState?.safeGuardian

  const isAlreadySet = selectedSafeGuardian?.address === delegate?.address

  const toggleShowAll = () => {
    setShowAll(prev => !prev)
  }

  const onView = (delegate: FileDelegate) => {
    storeScrollPosition()

    setExpandedDelegate(delegate)
  }

  const onClose = () => {
    setExpandedDelegate(undefined)

    restoreScrollPosition()
  }

  const onSelect = (delegate: FileDelegate) => {
    setStepperState(prev => ({
      ...prev,
      safeGuardian: delegate,
      selectedDelegate: delegate,
    }))

    setShowAll(false)

    onClose()
  }

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
  }

  const filteredDelegates = useMemo(() => {
    if (!delegates || delegates.length === 0) {
      return []
    }

    let currentDelegates = search ? filterDelegates(search, delegates) : delegates

    if (selectedSafeGuardian) {
      currentDelegates = [
        selectedSafeGuardian,
        ...currentDelegates.filter(delegate => delegate.address !== selectedSafeGuardian.address),
      ]
    }

    return showAll ? currentDelegates : currentDelegates.slice(0, SLICE_SIZE)
  }, [delegates, search, selectedSafeGuardian, showAll])

  return (
    <>
      <Grid item xs={8}>
        <TextField
          fullWidth
          onChange={onSearch}
          variant="outlined"
          value={search}
          placeholder="Search name, address or ENS"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ fill: theme => theme.palette.primary.light }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item>
        <Typography variant="subtitle1">{delegates.length} available delegates</Typography>
      </Grid>

      {expandedDelegate ? (
        <Grid item xs>
          <ExpandedDelegateCard
            delegate={expandedDelegate}
            onClick={() => onSelect(expandedDelegate)}
            onClose={onClose}
          />
        </Grid>
      ) : (
        <>
          <Grid container item xs={12} spacing={2}>
            {filteredDelegates.map(delegate => (
              <Grid item xs={6} key={delegate.address}>
                <DelegateCard
                  selected={delegate.address === selectedSafeGuardian?.address}
                  delegate={delegate}
                  onClick={() => onView(delegate)}
                />
              </Grid>
            ))}
          </Grid>

          <Button variant="text" onClick={toggleShowAll} sx={{ width: '100%' }}>
            {showAll ? 'Show less' : 'Show all'}
          </Button>
        </>
      )}

      {selectedSafeGuardian && !expandedDelegate && (
        <NavButtons onNext={onNext} isNextDisabled={isAlreadySet} />
      )}
    </>
  )
}
