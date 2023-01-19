import { Card, CardActionArea, CardContent, Grid, SvgIcon, Typography } from '@mui/material'
import { useEffect } from 'react'
import type { ReactElement, Dispatch, SetStateAction } from 'react'

import DelegatesIcon from '@/public/images/delegates.svg'
import CustomAddress from '@/public/images/custom-address.svg'
import { SelectedBadge } from '@/components/SelectedBadge'
import { DelegateType } from '@/components/Delegation/steps/SelectDelegate'
import { useDelegationStepper } from '@/components/Delegation'

import css from './styles.module.css'

const DelegateSwitchCard = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactElement | ReactElement[]
}) => {
  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        borderColor: ({ palette }) => (selected ? palette.primary.main : undefined),
        width: '100%',
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent className={css.content}>{children}</CardContent>
      </CardActionArea>
    </Card>
  )
}

export const DelegateSwitch = ({
  delegateType,
  setDelegateType,
}: {
  delegateType?: DelegateType
  setDelegateType: Dispatch<SetStateAction<DelegateType | undefined>>
}) => {
  const isSafeGuardianDelegation = delegateType === DelegateType.SAFE_GUARDIAN
  const isCustomDelegation = delegateType === DelegateType.CUSTOM

  const { setStepperState } = useDelegationStepper()

  useEffect(() => {
    setStepperState(prev => ({
      ...prev,
      selectedDelegate: isSafeGuardianDelegation
        ? prev?.safeGuardian
        : isCustomDelegation
        ? prev?.customDelegate
        : undefined,
    }))
  }, [delegateType, isCustomDelegation, isSafeGuardianDelegation, setStepperState])

  return (
    <Grid container justifyContent="space-between" flexWrap="nowrap" gap={2}>
      <Grid item xs={6}>
        <SelectedBadge invisible={!delegateType || isCustomDelegation}>
          <DelegateSwitchCard
            selected={isSafeGuardianDelegation}
            onClick={() => setDelegateType(DelegateType.SAFE_GUARDIAN)}
          >
            <SvgIcon component={DelegatesIcon} inheritViewBox fontSize="small" />
            <Typography>Delegate to a Safe Guardian</Typography>
          </DelegateSwitchCard>
        </SelectedBadge>
      </Grid>

      <Grid item xs={6}>
        <SelectedBadge invisible={!delegateType || isSafeGuardianDelegation}>
          <DelegateSwitchCard
            selected={isCustomDelegation}
            onClick={() => setDelegateType(DelegateType.CUSTOM)}
          >
            <SvgIcon component={CustomAddress} inheritViewBox fontSize="small" />
            <Typography>Custom address</Typography>
          </DelegateSwitchCard>
        </SelectedBadge>
      </Grid>
    </Grid>
  )
}
