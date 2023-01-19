import { CircularProgress, Grid } from '@mui/material'
import { useState } from 'react'
import type { ReactElement } from 'react'

import { SelectedDelegate } from '@/components/SelectedDelegate'
import { TotalVotingPower } from '@/components/TotalVotingPower'
import { useDelegationStepper } from '@/components/Delegation'
import { NavButtons } from '@/components/NavButtons'
import { StepHeader } from '@/components/StepHeader'
import { useWeb3 } from '@/hooks/useWeb3'
import { setDelegate } from '@/services/delegate-registry'
import { invalidateContractDelegateCache } from '@/hooks/useContractDelegate'
import { useIsWrongChain } from '@/hooks/useIsWrongChain'

export const ReviewDelegate = (): ReactElement => {
  const web3 = useWeb3()
  const isWrongChain = useIsWrongChain()
  const { stepperState, onBack, onNext } = useDelegationStepper()

  const [processing, setProcessing] = useState(false)

  const onConfirm = async () => {
    if (!web3 || !stepperState?.selectedDelegate?.address) {
      return
    }

    setProcessing(true)

    const tx = await setDelegate(web3, stepperState.selectedDelegate.address)

    setProcessing(false)

    if (!tx) {
      return
    }

    invalidateContractDelegateCache()
    onNext()
  }

  return (
    <Grid container p={6} gap={4}>
      <Grid item xs={12}>
        <StepHeader title="Choose a delegate" />
      </Grid>

      <Grid item xs={12}>
        <TotalVotingPower />
      </Grid>

      <Grid item xs={12}>
        <SelectedDelegate delegate={stepperState?.selectedDelegate} />
      </Grid>

      <NavButtons
        onBack={onBack}
        onNext={onConfirm}
        nextLabel={processing ? <CircularProgress size={20} /> : 'Confirm'}
        isBackDisabled={processing}
        isNextDisabled={processing || isWrongChain}
      />
    </Grid>
  )
}
