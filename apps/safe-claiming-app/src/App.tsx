import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { Typography, CircularProgress, styled } from "@mui/material"
import {
  lazy,
  ReactElement,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { ProgressBar } from "src/components/helpers/ProgressBar"
import { useLocalStorage } from "src/hooks/useLocalStorage"
import { FloatingTiles } from "./components/helpers/FloatingTiles"
import { ScrollContextProvider } from "./components/helpers/ScrollContext"
import {
  ECOSYSTEM_AIRDROP_ADDRESS,
  USER_AIRDROP_ADDRESS,
} from "./config/constants"
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

const LS_APP_STATE = "claimingApp"

const EDUCATION_END = 5
const CLAIM_STEP = EDUCATION_END + 2
const STATUS_STEP = EDUCATION_END + 3
const SUCCESS_STEP = EDUCATION_END + 4
const NO_AIRDROP_STEP = EDUCATION_END + 5

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
  lazy(() => import("src/components/steps/Status")),
  lazy(() => import("src/components/steps/Success")),
  lazy(() => import("src/components/steps/NoAirdrop")),
]

type PersistedAppState = {
  delegate?: DelegateEntry
  safeTxHash?: string
  claimedAmount?: string
}

export type AppState = PersistedAppState & {
  ecosystemClaim: VestingClaim | null
  userClaim: VestingClaim | null
  isTokenPaused: boolean
  delegateAddressFromContract?: string
  lastClaimTimestamp: number
  delegateData: DelegateEntry[]
}

const initialState: AppState = {
  ecosystemClaim: null,
  userClaim: null,
  isTokenPaused: true,
  lastClaimTimestamp: new Date().getTime(),
  delegateData: [],
}

const App = (): ReactElement => {
  const localStorage = useLocalStorage()

  const stateFromLocalStorage =
    localStorage.getItem<PersistedAppState>(LS_APP_STATE) || {}

  const [appState, setAppState] = useState<AppState>({
    ...stateFromLocalStorage,
    ...initialState,
  })

  const { safe } = useSafeAppsSDK()

  const [delegates] = useDelegatesFile()

  const [vestings, isVestingLoading] = useAirdropFile()
  const [userVesting, ecosystemVesting] = vestings

  const userVestingStatus = useFetchVestingStatus(
    userVesting?.vestingId,
    USER_AIRDROP_ADDRESS,
    appState.lastClaimTimestamp
  )

  const ecosystemVestingStatus = useFetchVestingStatus(
    ecosystemVesting?.vestingId,
    ECOSYSTEM_AIRDROP_ADDRESS,
    appState.lastClaimTimestamp
  )

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
    handleUpdateState({
      ...appState,
      userClaim,
      ecosystemClaim,
      delegate: currentDelegate,
      isTokenPaused,
      delegateAddressFromContract,
      delegateData: delegates,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userClaim, ecosystemClaim, isTokenPaused, delegates])

  const [activeStep, setActiveStep] = useState<number>(
    appState?.safeTxHash ? STATUS_STEP : appState?.delegate ? CLAIM_STEP : 0
  )

  useEffect(() => {
    if (
      userVesting === null &&
      ecosystemVesting === null &&
      !isVestingLoading
    ) {
      setActiveStep(NO_AIRDROP_STEP)
    }
  }, [userVesting, ecosystemVesting, isVestingLoading])

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

  const handleUpdateState = useCallback(
    (newState: AppState) => {
      setAppState(newState)
      localStorage.setItem<PersistedAppState>(LS_APP_STATE, {
        delegate: newState.delegate,
        safeTxHash: newState.safeTxHash,
        claimedAmount: newState.claimedAmount,
      })
    },
    [localStorage]
  )

  const Step = steps[activeStep]

  const hasNoAirdrop = activeStep === NO_AIRDROP_STEP

  const progress = hasNoAirdrop ? 0 : activeStep / (steps.length - 2)

  return (
    <>
      <FloatingTiles
        maxTiles={72}
        progress={progress}
        color={
          hasNoAirdrop
            ? theme.palette.primary.main
            : theme.palette.safeGreen.main
        }
      />

      <ScrollContextProvider>
        <Container>
          {safe.chainId !== 1 && safe.chainId !== 4 ? (
            <Typography variant="h1">
              Only Mainnet and Rinkeby are supported by this app.
            </Typography>
          ) : (
            <div>
              {typeof userVesting === "undefined" ||
              typeof ecosystemVesting === "undefined" ? (
                <div>
                  <Typography variant="h3">
                    <CircularProgress /> Loading airdrop data for connected safe
                  </Typography>
                </div>
              ) : (
                <>
                  {!hasNoAirdrop && <ProgressBar progress={progress} />}
                  <Suspense fallback={null}>
                    <Step
                      handleBack={handleBack}
                      handleNext={handleNext}
                      state={appState}
                      handleUpdateState={handleUpdateState}
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
