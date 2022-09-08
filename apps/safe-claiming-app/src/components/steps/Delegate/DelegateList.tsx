import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import React, { useMemo, useState } from "react"
import { DelegateCard } from "./DelegateCard"
import { DelegateEntry } from "src/hooks/useDelegatesFile"

const filterDelegates = (searchTerm: string, delegateData: DelegateEntry[]) => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase()
  return delegateData.filter((delegate) =>
    [delegate.address, delegate.ens, delegate.name].some((value) =>
      value
        ?.toLowerCase()
        .split(" ")
        .some((splitValue) => splitValue.startsWith(lowerCaseSearchTerm))
    )
  )
}

export const DelegateList = ({
  chosenDelegate,
  onCardClick,
  delegateData,
  showAll,
  setShowAll,
}: {
  chosenDelegate?: DelegateEntry
  onCardClick: (delegate: DelegateEntry) => void
  delegateData: DelegateEntry[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [delegateSearchTerm, setDelegateSearchTerm] = useState("")
  const filteredDelegates = useMemo(() => {
    let currentDelegates =
      delegateSearchTerm.length > 0
        ? filterDelegates(delegateSearchTerm, delegateData)
        : delegateData

    if (chosenDelegate) {
      currentDelegates = [
        chosenDelegate,
        ...currentDelegates.filter(
          (delegate) => delegate.address !== chosenDelegate.address
        ),
      ]
    }

    if (!showAll) {
      currentDelegates = currentDelegates.slice(
        0,
        Math.min(currentDelegates.length, 6)
      )
    }
    return currentDelegates
  }, [chosenDelegate, delegateData, delegateSearchTerm, showAll])

  return (
    <>
      <Grid
        container
        alignItems="flex-end"
        justifyContent="space-between"
        gap={2}
      >
        <Grid item xs={8}>
          <TextField
            fullWidth
            onChange={(event) =>
              setDelegateSearchTerm(event.currentTarget.value)
            }
            variant="outlined"
            value={delegateSearchTerm}
            placeholder="Search name, address or ENS"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ fill: (theme) => theme.palette.primary.light }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            {delegateData.length} available delegates
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {filteredDelegates.map((delegateCandidate) => (
          <Grid item xs={6} key={delegateCandidate.address}>
            <DelegateCard
              selected={delegateCandidate.address === chosenDelegate?.address}
              delegate={delegateCandidate}
              onClick={onCardClick}
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="text" onClick={() => setShowAll((prev) => !prev)}>
        {showAll ? "Show less" : "Show all"}
      </Button>
    </>
  )
}
