import { CircularProgress, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useState, useEffect } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { isAddress } from 'ethers/lib/utils'
import type { ReactElement, ChangeEvent } from 'react'

import { useEnsResolution } from '@/hooks/useEnsResolution'
import { InfoAlert } from '@/components/InfoAlert'
import { NavButtons } from '@/components/NavButtons'
import { useDelegationStepper } from '@/components/Delegation'
import { useDelegate } from '@/hooks/useDelegate'

export const CustomDelegate = (): ReactElement => {
  const { onNext, setStepperState, stepperState } = useDelegationStepper()

  const delegate = useDelegate()

  const [search, setSearch] = useState('')

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
  }

  const [ensAddress, ensError, ensLoading] = useEnsResolution(search)
  const isValidEnsAddress = ensAddress && isAddress(ensAddress)

  const isAlreadySet = stepperState?.selectedDelegate?.address === delegate?.address

  useEffect(() => {
    const delegate = isValidEnsAddress ? { address: ensAddress } : undefined
    setStepperState(prev => ({
      ...prev,
      customDelegate: delegate,
      selectedDelegate: delegate,
    }))
  }, [isValidEnsAddress, ensAddress, setStepperState])

  return (
    <>
      <Typography>
        The wallet address can belong to any person but you cannot delegate to your own Safe.
      </Typography>

      <TextField
        fullWidth
        onChange={onSearch}
        variant="outlined"
        value={search}
        placeholder="Search address or ENS"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ fill: theme => theme.palette.primary.light }} />
            </InputAdornment>
          ),
          endAdornment: ensLoading ? (
            <InputAdornment position="end">
              <CircularProgress />
            </InputAdornment>
          ) : ensAddress ? (
            <InputAdornment position="end">
              <CheckCircleRoundedIcon color="primary" />
            </InputAdornment>
          ) : undefined,
        }}
        error={!!ensError}
        helperText={isValidEnsAddress && ensAddress !== search ? ensAddress : ensError}
      />

      <InfoAlert>
        <Typography variant="subtitle1">
          For gasless voting, we suggest selecting an EOA wallet e.g. your connected wallet.
        </Typography>
      </InfoAlert>

      <NavButtons
        onNext={onNext}
        isNextDisabled={!ensAddress || !!ensError || ensLoading || isAlreadySet}
      />
    </>
  )
}
