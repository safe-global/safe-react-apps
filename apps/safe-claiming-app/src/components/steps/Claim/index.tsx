import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material"
import { ChangeEvent, useState } from "react"
import { AppState } from "src/App"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"

import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"
import { maxDecimals, minMaxValue, mustBeFloat } from "src/utils/validation"

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { BigNumber, ethers } from "ethers"
import { useAmounts } from "src/hooks/useAmounts"
import { InfoOutlined } from "@mui/icons-material"
import { ClaimCard } from "./ClaimCard"
import { formatAmount } from "src/utils/format"
import { NavButtons } from "src/components/helpers/NavButtons"
import { createClaimAndDelegateTxs } from "src/utils/contracts/createClaimAndDelegateTxs"

const ButtonLink = styled("button")`
  border: 0;
  background: none;
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`

type Props = {
  handleBack: () => void
  handleNext: () => void
  state: AppState
  handleUpdateState: (newState: AppState) => void
}

const validateAmount = (amount: string, maxAmount: string) => {
  return (
    mustBeFloat(amount) ??
    minMaxValue(0, maxAmount, amount) ??
    maxDecimals(amount, 18)
  )
}

const Claim = ({ handleBack, state, handleUpdateState, handleNext }: Props) => {
  const { sdk, safe } = useSafeAppsSDK()
  const { delegate, userClaim, ecosystemClaim, investorClaim, isTokenPaused } =
    state
  const [amount, setAmount] = useState<string>()
  const [isMaxAmountSelected, setIsMaxAmountSelected] = useState(false)
  const [amountError, setAmountError] = useState<string>()

  const [userAirdropClaimable, userAirdropInVesting] = useAmounts(userClaim)
  const [ecosystemClaimable, ecosystemInVesting] = useAmounts(ecosystemClaim)
  const [investorClaimable, investorInVesting] = useAmounts(investorClaim)

  const totalAmountClaimable = BigNumber.from(userAirdropClaimable)
    .add(BigNumber.from(ecosystemClaimable))
    .add(BigNumber.from(investorClaimable))
    .toString()
  const totalAmountInVesting = BigNumber.from(userAirdropInVesting)
    .add(BigNumber.from(ecosystemInVesting))
    .add(BigNumber.from(investorInVesting))
    .toString()

  const totalAllocation = BigNumber.from(userClaim?.amount || "0")
    .add(ecosystemClaim?.amount || "0")
    .add(investorClaim?.amount || "0")
    .toString()

  const hasDelegateChanged =
    state.delegate !== undefined &&
    state.delegateAddressFromContract !== state.delegate.address

  const investorClaimingDisabled = investorClaim !== null && isTokenPaused

  const isAmountGTZero = amount && !amountError && Number.parseFloat(amount) > 0

  const buttonDisabled =
    !(isAmountGTZero || hasDelegateChanged) ||
    (investorClaimingDisabled && isAmountGTZero) ||
    !!amountError

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const error = validateAmount(
      event.target.value,
      ethers.utils.formatEther(totalAmountClaimable)
    )
    setAmountError(error)
    setAmount(event.target.value)
  }

  const setToMaxAmount = () => {
    const amountAsNumber = Number(
      ethers.utils.formatEther(totalAmountClaimable)
    )
    setAmount(amountAsNumber.toFixed(2))
    setIsMaxAmountSelected(true)
    setAmountError(undefined)
  }

  const claimTokens = async () => {
    const txs = createClaimAndDelegateTxs({
      appState: state,
      amount: amount || "0",
      chainId: safe.chainId,
      safeAddress: safe.safeAddress,
      investorClaimable,
      userClaimable: userAirdropClaimable,
      isMaxAmountSelected,
    })

    try {
      await sdk.txs.send({ txs })

      handleUpdateState({
        ...state,
        claimedAmount: amount,
      })
      handleNext()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        height: 1,
        gap: 4,
        zIndex: 999,
      }}
    >
      <Grid container flexWrap="nowrap" gap={3}>
        <Grid item xs={8}>
          <Typography variant="h2">Your SAFE allocation:</Typography>
        </Grid>
      </Grid>
      <Grid container flexWrap="nowrap" gap={3}>
        <ClaimCard
          variant="claimable"
          isGuardian={ecosystemClaim !== null}
          totalAmount={totalAmountClaimable}
          ecosystemAmount={ecosystemClaimable}
        />
        <ClaimCard
          variant="vesting"
          isGuardian={ecosystemClaim !== null}
          totalAmount={totalAmountInVesting}
          ecosystemAmount={ecosystemInVesting}
        />
      </Grid>
      <Box display="flex" mt={-2} gap={1}>
        <InfoOutlined
          sx={{
            height: "16px",
            width: "16px",
            marginTop: "4px",
            color: ({ palette }) => palette.secondary.main,
          }}
        />
        <Typography variant="subtitle2">
          Awarded total allocation is{" "}
          <span style={{ color: "#121312" }}>
            {formatAmount(Number(ethers.utils.formatEther(totalAllocation)), 2)}{" "}
            SAFE
          </span>
        </Typography>
      </Box>

      <Grid container>
        <Grid item xs={12}>
          <Divider sx={{ marginBottom: 4 }} />
        </Grid>
        <Grid item xs={12} marginBottom={3}>
          <>
            <Typography variant="h4" marginBottom={1}>
              How much do you want to claim?
            </Typography>
            <Typography variant="subtitle1" marginBottom={2}>
              Select all tokens or define a custom amount.
            </Typography>
            <Grid container gap={2} flexWrap="nowrap">
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={amount || ""}
                  error={!!amountError}
                  helperText={amountError || " "}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    handleAmountChange(event)
                    setIsMaxAmountSelected(false)
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SafeIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <ButtonLink onClick={setToMaxAmount}>Max</ButtonLink>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "12px 14px 12px 0",
                      fontWeight: 700,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  size="large"
                  disableElevation
                  sx={{ width: 1, paddingX: 0 }}
                  disabled={buttonDisabled}
                  onClick={claimTokens}
                >
                  Claim and delegate
                </Button>
              </Grid>
            </Grid>
            {!investorClaim && (
              <Box display="flex" gap={1} mt={0} mb={4}>
                <InfoOutlined
                  sx={{
                    height: "16px",
                    width: "16px",
                    marginTop: "4px",
                    color: ({ palette }) => palette.secondary.main,
                  }}
                />
                <Typography variant="subtitle2">
                  Execute at least one claim of any amount of tokens until
                  27.12.22 10:00 CET or your allocation will be transferred back
                  to the SafeDAO treasury
                </Typography>
              </Box>
            )}
            {investorClaim && isTokenPaused && (
              <Box display="flex" gap={1} mt={0} mb={4}>
                <InfoOutlined
                  sx={{
                    height: "16px",
                    width: "16px",
                    marginTop: "4px",
                    color: ({ palette }) => palette.secondary.main,
                  }}
                />
                <Typography variant="subtitle2">
                  Claiming will be available once the token is transferable
                </Typography>
              </Box>
            )}
          </>
        </Grid>
        {delegate && (
          <Grid item xs={12}>
            <Typography variant="body1" marginBottom={1}>
              Delegating to
            </Typography>
            <SelectedDelegate delegate={delegate} onClick={handleBack} />
            <Box display="flex" gap={1} mt={2}>
              <InfoOutlined
                sx={{
                  height: "16px",
                  width: "16px",
                  marginTop: "4px",
                  color: ({ palette }) => palette.secondary.main,
                }}
              />
              <Typography variant="subtitle2">
                You only delegate your voting power and not the ownership over
                your tokens.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      <NavButtons handleBack={handleBack} />
    </Paper>
  )
}

export default Claim
