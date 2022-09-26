import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import {
  Box,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useEnsResolution } from "src/hooks/useEnsResolution"

import { AppState } from "src/App"
import { DelegateList } from "./DelegateList"
import { DelegateSwitch } from "./DelegateSwitch"
import { ExpandedDelegateCard } from "./ExpandedDelegateCard"
import { DelegateEntry } from "src/hooks/useDelegatesFile"
import { NavButtons } from "src/components/helpers/NavButtons"
import { useScrollContext } from "src/components/helpers/ScrollContext"
import SearchIcon from "@mui/icons-material/Search"

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
        gap: 3,
      }}
    >
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="h2">Choose a delegate</Typography>
        </Box>
        <Typography>
          A delegate is someone you select to make governance decisions on your
          behalf. You still retain full ownership of your tokens, but your
          delegate will wield the voting power associated with those tokens,
          including your unvested allocation.
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
                <Grid item xs={12}>
                  <Typography mb={1}>
                    You can select yourself or any other person to be a
                    delegate.
                  </Typography>
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
                    sx={{
                      "& .MuiFormHelperText-root": {
                        margin: 0,
                      },
                    }}
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
                            For gasless voting, we suggest selecting an EOA
                            wallet e.g. your connected wallet.
                          </Typography>
                        </Box>
                      )
                    }
                    placeholder="Search name, address or ENS"
                    InputProps={{
                      endAdornment: customEnsLoading ? (
                        <CircularProgress />
                      ) : isValidCustomAddressSet ? (
                        <CheckCircleRoundedIcon color="primary" />
                      ) : null,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            fontSize="small"
                            sx={{
                              fill: (theme) => theme.palette.primary.light,
                            }}
                          />
                        </InputAdornment>
                      ),
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
