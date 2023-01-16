import { lazy } from 'react'

import { createStepperContext } from '@/services/StepperFactory'
import type { FileDelegate } from '@/hooks/useDelegatesFile'
import type { Delegate } from '@/hooks/useDelegate'
import type { ContractDelegate } from '@/hooks/useContractDelegate'

const steps = [
  lazy(() => import('@/components/Delegation/steps/SelectDelegate')),
  lazy(() => import('@/components/Delegation/steps/ReviewDelegate')),
  lazy(() => import('@/components/Delegation/steps/SuccessfulDelegation')),
]

type DelegationStepperState = {
  safeGuardian?: FileDelegate
  customDelegate?: ContractDelegate
  selectedDelegate?: Delegate
}

const DelegationContext = createStepperContext<DelegationStepperState>({
  steps,
  state: {
    safeGuardian: undefined,
    customDelegate: undefined,
    selectedDelegate: undefined,
  },
})

export const useDelegationStepper = DelegationContext.useStepper

export const Delegation = DelegationContext.Provider
