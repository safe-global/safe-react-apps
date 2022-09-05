import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useEnsResolution } from "src/hooks/useEnsResolution"

import { AppState } from "src/App"
import { DelegateList } from "./DelegateList"
import { DelegateSwitch } from "./DelegateSwitch"
import { ExpandedDelegateCard } from "./ExpandedDelegateCard"
import { DelegateEntry } from "src/hooks/useDelegatesFile"
import { NavButtons } from "src/components/helpers/NavButtons"
import { useScrollContext } from "src/components/helpers/ScrollContext"

const Delegate = ({
  handleNext,
  handleBack,
  handleUpdateState,
  state,
}: {
  handleNext: () => void
  handleBack: () => void
  handleUpdateState: (newState: AppState) => void
  state: AppState
}) => {
  const { delegate, delegateData } = state
  const delegateAddress = delegate?.address
  const delegateENSName = delegate?.ens
  const chosenDelegateFromList = delegateData.find(
    (delegateFromList) => delegateFromList.address === delegateAddress
  )
  const isCustomDelegate = Boolean(delegateAddress) && !chosenDelegateFromList

  const [customAddress, setCustomAddress] = useState(
    isCustomDelegate ? delegateENSName ?? delegateAddress ?? "" : ""
  )
  const [chosenDelegate, setChosenDelegate] = useState<
    DelegateEntry | undefined
  >(chosenDelegateFromList)
  const [expandedDelegate, setExpandedDelegate] = useState<
    DelegateEntry | undefined
  >(undefined)
  const [isCustomDelegation, setIsCustomDelegation] = useState(isCustomDelegate)

  const [showAll, setShowAll] = useState(false)

  const scrollContext = useScrollContext()

  const [customEnsResult, customAddressError, customEnsLoading] =
    useEnsResolution(customAddress)

  const isValidCustomAddressSet = isCustomDelegation && Boolean(customEnsResult)

  const handleBackButton = () => {
    if (expandedDelegate) {
      setExpandedDelegate(undefined)
    } else {
      handleBack()
    }
  }

  // If we toggle to custom delegation we have to update the state with the custom ens resolved address
  const submitDelegate = () => {
    if (isCustomDelegation && customEnsResult) {
      handleUpdateState({
        ...state,
        delegate: customEnsResult,
      })
    } else {
      handleUpdateState({
        ...state,
        delegate: chosenDelegate,
      })
    }

    handleNext()
  }

  const onCardSelect = (chosenDelegate: DelegateEntry) => {
    setChosenDelegate(chosenDelegate)
    closeExpandedDelegateCard(false)
    setShowAll(false)
  }

  const onCardClick = (clickedDelegate: DelegateEntry) => {
    // Store scroll position
    scrollContext.storeScrollPosition()
    setExpandedDelegate(clickedDelegate)
  }

  const closeExpandedDelegateCard = (restoreScrollPosition: boolean) => {
    setExpandedDelegate(undefined)
    restoreScrollPosition && scrollContext.restoreScrollPosition()
  }

  const enableNextButton =
    (isCustomDelegation && Boolean(customEnsResult)) ||
    (!isCustomDelegation && Boolean(chosenDelegate))

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        height: 1,
        gap: 2,
      }}
    >
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="h2">Choose a delegate</Typography>
          <Typography variant="subtitle1">Step 2 of 3</Typography>
        </Box>
        <Typography marginBottom={2}>
          A delegate is someone you select to make governance decisions on your
          behalf for all of your vested and unvested tokens. You still retain
          full ownership over your tokens and you can always change the delegate
          at a later point.
        </Typography>
        {expandedDelegate ? (
          <div style={{ position: "relative" }}>
            <ExpandedDelegateCard
              delegate={expandedDelegate}
              onClick={onCardSelect}
              onClose={() => closeExpandedDelegateCard(true)}
              selected={chosenDelegate?.address === expandedDelegate?.address}
            />
          </div>
        ) : (
          <>
            <DelegateSwitch
              isCustomDelegation={isCustomDelegation}
              setIsCustomDelegation={setIsCustomDelegation}
            />
            {isCustomDelegation && (
              <Grid
                container
                alignItems="flex-end"
                justifyContent="space-between"
                gap={2}
              >
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    color={isValidCustomAddressSet ? "primary" : undefined}
                    focused={isValidCustomAddressSet}
                    onChange={(event) =>
                      setCustomAddress(event.currentTarget.value)
                    }
                    variant="outlined"
                    value={customAddress}
                    error={Boolean(customAddressError)}
                    helperText={
                      customAddressError || (
                        <Box display="flex" gap={1} mt={2}>
                          <InfoOutlined
                            sx={{
                              height: "16px",
                              width: "16px",
                              marginTop: "4px",
                              color: ({ palette }) => palette.secondary.main,
                            }}
                          />
                          <Typography variant="subtitle1">
                            An EOA address is recommended to enable gasless
                            voting.
                          </Typography>
                        </Box>
                      )
                    }
                    placeholder="Address or ENS"
                    InputProps={{
                      endAdornment: customEnsLoading ? (
                        <CircularProgress />
                      ) : isValidCustomAddressSet ? (
                        <CheckCircleRoundedIcon color="primary" />
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid item />
              </Grid>
            )}
            {!isCustomDelegation && (
              <DelegateList
                chosenDelegate={chosenDelegate}
                onCardClick={onCardClick}
                delegateData={delegateData}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            )}

            <NavButtons
              handleBack={handleBackButton}
              handleNext={submitDelegate}
              isNextEnabled={enableNextButton}
            />
          </>
        )}
      </>
    </Paper>
  )
}

export default Delegate
