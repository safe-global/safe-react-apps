import { createStepperContext } from '@/services/StepperFactory'
import { Disclaimer } from '@/components/EducationSeries/steps/Disclaimer'
import { Distribution } from '@/components/EducationSeries/steps/Distribution'
import { SafeDao } from '@/components/EducationSeries/steps/SafeDao'
import { SafeInfo } from '@/components/EducationSeries/steps/SafeInfo'
import { SafeToken } from '@/components/EducationSeries/steps/SafeToken'

const steps = [<SafeInfo />, <Distribution />, <SafeToken />, <SafeDao />, <Disclaimer />]

const EducationSeriesContext = createStepperContext({ steps })

export const useEducationSeriesStepper = EducationSeriesContext.useStepper

export const EducationSeries = EducationSeriesContext.Provider
