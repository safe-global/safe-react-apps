import { lazy } from 'react'

import { createStepperContext } from '@/services/StepperFactory'

const steps = [
  lazy(() => import('@/components/EducationSeries/steps/SafeInfo')),
  lazy(() => import('@/components/EducationSeries/steps/Distribution')),
  lazy(() => import('@/components/EducationSeries/steps/SafeToken')),
  lazy(() => import('@/components/EducationSeries/steps/SafeDao')),
  lazy(() => import('@/components/EducationSeries/steps/Disclaimer')),
]

const EducationSeriesContext = createStepperContext({ steps })

export const useEducationSeriesStepper = EducationSeriesContext.useStepper

export const EducationSeries = EducationSeriesContext.Provider
