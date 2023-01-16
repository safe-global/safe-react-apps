import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

import { DelegateList } from '@/components/DelegateList'
import { DelegateSwitch } from '@/components/DelegateSwitch'
import { CustomDelegate } from '@/components/CustomDelegate'
import { StepHeader } from '@/components/StepHeader'
import { useDelegate } from '@/hooks/useDelegate'
import { useDelegatesFile } from '@/hooks/useDelegatesFile'
import { useDelegationStepper } from '@/components/Delegation'

export const enum DelegateType {
  CUSTOM = 'CUSTOM',
  SAFE_GUARDIAN = 'SAFE_GUARDIAN',
}

const SelectDelegate = (): ReactElement => {
  const [delegateType, setDelegateType] = useState<DelegateType>()

  // Initialize stepper state with contract delegate if it exists
  const { setStepperState } = useDelegationStepper()
  const delegate = useDelegate()
  const { data: delegateFiles } = useDelegatesFile()

  useEffect(() => {
    if (!delegate) {
      return
    }

    const safeGuardian = delegateFiles?.find(({ address }) => address === delegate?.address)

    setStepperState(prev => ({
      ...prev,
      selectedDelegate: delegate,
      customDelegate: safeGuardian ? undefined : delegate,
      safeGuardian: safeGuardian ? safeGuardian : undefined,
    }))

    setDelegateType(safeGuardian ? DelegateType.SAFE_GUARDIAN : DelegateType.CUSTOM)
  }, [delegate, delegateFiles, setStepperState])

  return (
    <Grid container p={6} gap={3}>
      <Grid item xs={12}>
        <StepHeader title="Choose a delegate" />
      </Grid>

      <Grid item xs={12} container alignItems="flex-end" justifyContent="space-between" gap={2}>
        <Typography>
          A delegate is someone you select to make governance decisions on your behalf. You still
          retain full ownership of your tokens, but your delegate will wield the voting power
          associated with those tokens, including your unvested allocation.
        </Typography>

        <DelegateSwitch delegateType={delegateType} setDelegateType={setDelegateType} />

        {delegateType &&
          (delegateType === DelegateType.SAFE_GUARDIAN ? <DelegateList /> : <CustomDelegate />)}
      </Grid>
    </Grid>
  )
}

export default SelectDelegate
