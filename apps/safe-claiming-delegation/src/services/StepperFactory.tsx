/* eslint-disable @typescript-eslint/no-empty-function */

import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'
import type { JSXElementConstructor, ReactElement, Dispatch, SetStateAction } from 'react'

import { AppRoutes } from '@/config/routes'
import { ProgressBar } from '@/components/ProgressBar'

export const createStepperContext = <StepperState extends Record<string, unknown>>({
  steps,
  state,
}: {
  steps: (() => ReactElement<unknown, string | JSXElementConstructor<unknown>>)[]
  state?: StepperState
}) => {
  // Typed context
  const Context = createContext<{
    stepperState: StepperState | undefined
    setStepperState: Dispatch<SetStateAction<StepperState | undefined>>
    activeStep: number
    setActiveStep: Dispatch<SetStateAction<number>>
    onBack: () => void
    onNext: () => void
    progress: number
  }>({
    stepperState: undefined,
    setStepperState: () => {},
    activeStep: 0,
    setActiveStep: () => {},
    onBack: () => {},
    onNext: () => {},
    progress: 0,
  })

  // Typed Provider
  const Provider = () => {
    const router = useRouter()

    const [stepperState, setStepperState] = useState(state)

    const [activeStep, setActiveStep] = useState(0)

    const onBack = () => {
      if (activeStep > 0) {
        setActiveStep(activeStep - 1)
      }
    }

    const onNext = () => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      } else {
        router.push(AppRoutes.index)
      }
    }

    const progress = ((activeStep + 1) / steps.length) * 100

    const Step = steps[activeStep]

    return (
      <Context.Provider
        value={{
          stepperState,
          setStepperState,
          activeStep,
          setActiveStep,
          onBack,
          onNext,
          progress,
        }}
      >
        <ProgressBar value={progress} />
        <Step />
      </Context.Provider>
    )
  }

  const useStepper = () => {
    const stepperContext = useContext(Context)

    if (!stepperContext) {
      throw new Error('useStepper must be used within a StepperProvider')
    }

    return stepperContext
  }

  return {
    Provider,
    useStepper,
  }
}
