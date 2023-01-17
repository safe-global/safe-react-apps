import { createStepperContext } from '@/services/StepperFactory'
import { ClaimOverview } from '@/components/Claim/steps/ClaimOverview'
import { SuccessfulClaim } from '@/components/Claim/steps/SuccessfulClaim'

const steps = [<ClaimOverview />, <SuccessfulClaim />]

const ClaimContext = createStepperContext({
  steps,
  state: { claimedAmount: '' },
})

export const useClaimStepper = ClaimContext.useStepper

export const Claim = ClaimContext.Provider
