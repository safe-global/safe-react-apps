import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { styled } from "@mui/material"
import {
  lazy,
  ReactElement,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react"

import { ProgressBar } from "src/components/helpers/ProgressBar"
import { FloatingTiles } from "./components/helpers/FloatingTiles"
import { Loading } from "./components/helpers/Loading"
import { ScrollContextProvider } from "./components/helpers/ScrollContext"
import { UnexpectedError } from "./components/helpers/UnexpectedError"
import { UnsupportedNetwork } from "./components/helpers/UnsupportedNetwork"
import { Chains } from "./config/constants"
import theme from "./config/theme"
import { useAirdropFile } from "./hooks/useAirdropFile"
import { useDelegate } from "./hooks/useDelegate"
import { useDelegatesFile, DelegateEntry } from "./hooks/useDelegatesFile"
import { useFetchVestingStatus } from "./hooks/useFetchVestingStatus"
import { useIsTokenPaused } from "./hooks/useIsTokenPaused"
import { VestingClaim } from "./types/vestings"
import { sameAddress } from "./utils/addresses"

const Container = styled("div")`
  width: 650px;
  padding-top: 24px;
  position: relative;
  margin: auto;
`

const Circle = styled("div")`
  width: 450px;
  height: 450px;
  position: absolute;
  border-radius: 50%;
  z-index: -1;
  right: -100px;
  bottom: -100px;
  background: radial-gradient(circle, #5fddff 0%, rgb(246 247 248 / 0%) 70%);
`

const Circle2 = styled("div")`
  width: 350px;
  height: 350px;
  position: absolute;
  border-radius: 50%;
  z-index: -1;
  left: -100px;
  top: 50px;
  background: radial-gradient(
    circle,
    ${(props) => props.theme.palette.safeGreen.main} 0%,
    rgb(246 247 248 / 0%) 70%
  );
`
const EDUCATION_END = 5
const CLAIM_STEP = EDUCATION_END + 2
const SUCCESS_STEP = EDUCATION_END + 3
const NO_AIRDROP_STEP = EDUCATION_END + 4

const steps = [
  lazy(() => import("src/components/steps/Intro")),

  // Educational Series
  lazy(() => import("src/components/steps/SafeInfo")),
  lazy(() => import("src/components/steps/Distribution")),
  lazy(() => import("src/components/steps/Government")),
  lazy(() => import("src/components/steps/SafeNavigation")),
  lazy(() => import("src/components/steps/Disclaimer")),

  lazy(() => import("src/components/steps/Delegate")),
  lazy(() => import("src/components/steps/Claim")),
  lazy(() => import("src/components/steps/Success")),
  lazy(() => import("src/components/steps/NoAirdrop")),
]

export type AppState = {
  ecosystemClaim: VestingClaim | null
  userClaim: VestingClaim | null
  investorClaim: VestingClaim | null
  isTokenPaused: boolean
  delegateAddressFromContract?: string
  delegateData: DelegateEntry[]
  delegate?: DelegateEntry
  claimedAmount?: string
}

const initialState: AppState = {
  ecosystemClaim: null,
  userClaim: null,
  investorClaim: null,
  isTokenPaused: true,
  delegateData: [],
}

const App = (): ReactElement => {
  const [appState, setAppState] = useState<AppState>(initialState)

  const { safe } = useSafeAppsSDK()

  const [delegates, , delegatesFileError] = useDelegatesFile()

  const [vestings, isVestingLoading, vestingFileError] = useAirdropFile()
  const [userVesting, ecosystemVesting, investorVesting] = vestings

  const [userVestingStatus, userVestingStatusError] = useFetchVestingStatus(
    userVesting?.vestingId,
    userVesting?.contract
  )

  const [ecosystemVestingStatus, ecosystemVestingStatusError] =
    useFetchVestingStatus(
      ecosystemVesting?.vestingId,
      ecosystemVesting?.contract
    )

  const [investorVestingStatus, investorVestingStatusError] =
    useFetchVestingStatus(investorVesting?.vestingId, investorVesting?.contract)

  const userClaim: VestingClaim | null = useMemo(
    () =>
      userVesting && userVestingStatus
        ? { ...userVesting, ...userVestingStatus }
        : null,
    [userVestingStatus, userVesting]
  )
  const ecosystemClaim: VestingClaim | null = useMemo(
    () =>
      ecosystemVesting && ecosystemVestingStatus
        ? { ...ecosystemVesting, ...ecosystemVestingStatus }
        : null,
    [ecosystemVestingStatus, ecosystemVesting]
  )

  const investorClaim: VestingClaim | null = useMemo(
    () =>
      investorVesting && investorVestingStatus
        ? { ...investorVesting, ...investorVestingStatus }
        : null,
    [investorVestingStatus, investorVesting]
  )
  const isTokenPaused = useIsTokenPaused()

  const delegateAddressFromContract = useDelegate()

  const currentDelegate = useMemo(() => {
    if (appState.delegate) {
      return appState.delegate
    }

    if (delegateAddressFromContract) {
      const registeredDelegateFromData = delegates.find((entry) =>
        sameAddress(entry.address, delegateAddressFromContract)
      )
      return (
        registeredDelegateFromData || { address: delegateAddressFromContract }
      )
    }
  }, [appState.delegate, delegateAddressFromContract, delegates])

  useEffect(() => {
    setAppState((prev) => ({
      ...prev,
      userClaim,
      ecosystemClaim,
      investorClaim,
      delegate: currentDelegate,
      isTokenPaused,
      delegateAddressFromContract,
      delegateData: delegates,
    }))
  }, [
    userClaim,
    ecosystemClaim,
    investorClaim,
    isTokenPaused,
    delegates,
    currentDelegate,
    delegateAddressFromContract,
  ])

  const [activeStep, setActiveStep] = useState<number>(
    appState?.delegate ? CLAIM_STEP : 0
  )

  // once the delegate is fetched from on-chain we update the activeStep
  useEffect(() => {
    if (delegateAddressFromContract && !appState.delegate && activeStep === 0) {
      setAppState({
        ...appState,
        delegate: { address: delegateAddressFromContract },
      })
      setActiveStep(CLAIM_STEP)
    }
  }, [delegateAddressFromContract, appState, activeStep])

  useEffect(() => {
    if (
      userVesting === null &&
      ecosystemVesting === null &&
      investorVesting === null &&
      !isVestingLoading
    ) {
      setActiveStep(NO_AIRDROP_STEP)
    }
  }, [userVesting, ecosystemVesting, investorVesting, isVestingLoading])

  const handleBack = () => {
    if (activeStep === SUCCESS_STEP) {
      // Go back to claiming instead of status
      setActiveStep(CLAIM_STEP)
    } else {
      setActiveStep((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const Step = steps[activeStep]

  const hasNoAirdrop = activeStep === NO_AIRDROP_STEP

  const fatalError =
    vestingFileError ||
    delegatesFileError ||
    userVestingStatusError ||
    ecosystemVestingStatusError ||
    investorVestingStatusError

  const progress =
    hasNoAirdrop || fatalError ? 0 : activeStep / (steps.length - 2)

  const unsupportedChain =
    safe.chainId !== Chains.MAINNET &&
    safe.chainId !== Chains.RINKEBY &&
    safe.chainId !== Chains.GOERLI

  return (
    <>
      <FloatingTiles
        maxTiles={unsupportedChain ? 12 : 72}
        progress={progress}
        color={
          hasNoAirdrop || fatalError
            ? theme.palette.primary.main
            : theme.palette.safeGreen.main
        }
      />

      <ScrollContextProvider>
        <Container>
          {fatalError ? (
            <UnexpectedError error={fatalError} />
          ) : unsupportedChain ? (
            <UnsupportedNetwork />
          ) : (
            <div>
              {typeof userVesting === "undefined" ||
              typeof ecosystemVesting === "undefined" ? (
                <Loading />
              ) : (
                <>
                  {!hasNoAirdrop && <ProgressBar progress={progress} />}
                  <Suspense fallback={null}>
                    <Step
                      handleBack={handleBack}
                      handleNext={handleNext}
                      state={appState}
                      handleUpdateState={setAppState}
                    />
                  </Suspense>
                </>
              )}
            </div>
          )}
          {!hasNoAirdrop && <Circle />}
          {!hasNoAirdrop && <Circle2 />}
        </Container>
      </ScrollContextProvider>
    </>
  )
}

export default App
