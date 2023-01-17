import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import SafeToken from '@/public/images/token.svg'
import { formatEther } from 'ethers/lib/utils'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import type { ChangeEvent, ReactElement } from 'react'

import { SelectedDelegate } from '@/components/SelectedDelegate'
import { maxDecimals, minMaxValue, mustBeFloat } from '@/utils/validation'
import { ClaimCard } from '@/components/ClaimCard'
import { useSafeTokenAllocation } from '@/hooks/useSafeTokenAllocation'
import { useDelegate } from '@/hooks/useDelegate'
import { InfoAlert } from '@/components/InfoAlert'
import { getVestingTypes } from '@/utils/vesting'
import { formatAmount } from '@/utils/formatters'
import { useClaimStepper } from '@/components/Claim'
import { StepHeader } from '@/components/StepHeader'
import { createClaimTxs } from '@/utils/claim'
import { useIsTokenPaused } from '@/hooks/useIsTokenPaused'
import { useAllocationTypes } from '@/hooks/useAllocationTypes'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'

import css from './styles.module.css'

const validateAmount = (amount: string, maxAmount: string) => {
  return mustBeFloat(amount) || minMaxValue(0, maxAmount, amount) || maxDecimals(amount, 18)
}

export const ClaimOverview = (): ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const isWrongChain = useIsWrongChain()
  const { onNext, setStepperState } = useClaimStepper()

  const [amount, setAmount] = useState('')
  const [isMaxAmountSelected, setIsMaxAmountSelected] = useState(false)
  const [amountError, setAmountError] = useState<string>()
  const [creatingTxs, setCreatingTxs] = useState(false)

  const delegate = useDelegate()

  const { data: isTokenPaused } = useIsTokenPaused()

  // Allocation, vesting and claimable amounts
  const { data: allocation } = useSafeTokenAllocation()

  const { ecosystemVesting, investorVesting } = getVestingTypes(allocation?.vestingData || [])

  const { user, ecosystem, investor, total } = useAllocationTypes()
  const totalClaimableAmountInEth = formatEther(total.claimable)

  // Flags
  const isInvestorClaimingDisabled = !!investorVesting && isTokenPaused

  const isAmountGTZero = !!amount && !amountError && Number.parseFloat(amount) > 0

  const isClaimDisabled =
    !isAmountGTZero ||
    (isInvestorClaimingDisabled && isAmountGTZero) ||
    !!amountError ||
    creatingTxs ||
    isWrongChain

  // Handlers
  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const error = validateAmount(amount || '0', totalClaimableAmountInEth)
    setAmount(event.target.value)
    setAmountError(error)

    setIsMaxAmountSelected(false)
  }

  const setToMaxAmount = () => {
    const amountAsNumber = Number(formatEther(total.claimable))
    setAmount(amountAsNumber.toFixed(2))
    setAmountError(undefined)

    setIsMaxAmountSelected(true)
  }

  const onClaim = async () => {
    setCreatingTxs(true)

    const txs = createClaimTxs({
      vestingData: allocation?.vestingData ?? [],
      safeAddress: safe.safeAddress,
      isMax: isMaxAmountSelected,
      amount: amount || '0',
      userClaimable: user.claimable,
      investorClaimable: investor.claimable,
      isTokenPaused: !!isTokenPaused,
    })

    try {
      await sdk.txs.send({ txs })

      setStepperState(prev => ({
        ...prev,
        claimedAmount: amount,
      }))

      onNext()
    } catch (error) {
      console.error(error)
    }

    setCreatingTxs(false)
  }

  return (
    <Grid container p={6}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="Your SAFE allocation:" />
      </Grid>

      <Grid item container xs={12} flexWrap="nowrap" gap={3} mb={1}>
        <Grid item xs={6}>
          <ClaimCard
            variant="claimable"
            isGuardian={!!ecosystemVesting}
            totalAmount={total.claimable}
            ecosystemAmount={ecosystem.claimable}
          />
        </Grid>
        <Grid item xs={6}>
          <ClaimCard
            variant="vesting"
            isGuardian={!!ecosystemVesting}
            totalAmount={total.inVesting}
            ecosystemAmount={ecosystem.inVesting}
          />
        </Grid>
      </Grid>

      <InfoAlert>
        <Typography variant="subtitle2">
          Total allocation is{' '}
          <Typography component="span" variant="inherit" color="text.primary">
            {formatAmount(formatEther(total.allocation), 2)} SAFE
          </Typography>
        </Typography>
      </InfoAlert>

      <Grid item xs={12} my={4}>
        <Divider />
      </Grid>

      <Typography variant="h4" fontWeight={700}>
        How much do you want to claim?
      </Typography>
      <Typography variant="subtitle1" mb={2}>
        Select all tokens or define a custom amount.
      </Typography>

      <Grid item container gap={2} flexWrap="nowrap" xs={12} mb={3}>
        <Grid item xs={9}>
          <TextField
            variant="outlined"
            fullWidth
            value={amount}
            error={!!amountError}
            helperText={amountError}
            onChange={onChangeAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ width: '24px', height: '24px' }}>
                  <SafeToken />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button onClick={setToMaxAmount} className={css.maxButton}>
                    Max
                  </button>
                </InputAdornment>
              ),
            }}
            className={css.input}
          />
        </Grid>

        <Grid item xs={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={onClaim}
            disableElevation
            disabled={isClaimDisabled}
          >
            {creatingTxs ? <CircularProgress size={20} /> : 'Claim'}
          </Button>
        </Grid>
      </Grid>

      {isInvestorClaimingDisabled && (
        <InfoAlert>
          <Typography variant="subtitle2" mb={3}>
            Claiming will be available once the token is transferable
          </Typography>
        </InfoAlert>
      )}

      {delegate && (
        <Grid item xs={12}>
          <SelectedDelegate delegate={delegate} hint />
        </Grid>
      )}
    </Grid>
  )
}
