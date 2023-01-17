import { createStepperContext } from '@/services/StepperFactory'
import { SelectDelegate } from '@/components/Delegation/steps/SelectDelegate'
import { ReviewDelegate } from '@/components/Delegation/steps/ReviewDelegate'
import { SuccessfulDelegation } from '@/components/Delegation/steps/SuccessfulDelegation'
import type { FileDelegate } from '@/hooks/useDelegatesFile'
import type { Delegate } from '@/hooks/useDelegate'
import type { ContractDelegate } from '@/hooks/useContractDelegate'

const steps = [<SelectDelegate />, <ReviewDelegate />, <SuccessfulDelegation />]

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
