import { Box, Button, Paper, Typography } from "@mui/material"
import { InfoOutlined } from "@mui/icons-material"
import { ProgressCircle } from "src/components/helpers/ProgressCircle"
import { useEffect } from "react"
import { TransactionStatus } from "@gnosis.pm/safe-react-gateway-sdk"
import { AppState } from "src/App"
import { usePendingTx } from "src/components/steps/Status/usePendingTx"
import { NavButtons } from "src/components/helpers/NavButtons"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { formatAmount } from "src/utils/format"
import { SelectedDelegate } from "../Claim/SelectedDelegate"

type Props = {
  handleBack: () => void
  handleNext: () => void
  state: AppState
  handleUpdateState: (newState: AppState) => void
}

const StatusMessages: Partial<Record<TransactionStatus, string>> = {
  [TransactionStatus.AWAITING_CONFIRMATIONS]: "Awaiting Confirmations",
  [TransactionStatus.AWAITING_EXECUTION]: "Transaction is being executed",
  [TransactionStatus.PENDING]: "Transaction is pending",
  [TransactionStatus.SUCCESS]: "Transaction is executed",
  [TransactionStatus.CANCELLED]: "Transaction cancelled",
  [TransactionStatus.FAILED]: "Transaction failed",
}

const getStatusMessage = (status?: TransactionStatus): string => {
  if (!status) return "Checking status"

  return StatusMessages[status] || ""
}

const Status = ({
  state,
  handleNext,
  handleUpdateState,
  handleBack,
}: Props) => {
  const status = usePendingTx(state?.safeTxHash)

  const hasDelegateChanged =
    state.delegateAddressFromContract !== state.delegate?.address

  const isPendingStatus =
    !status ||
    [
      TransactionStatus.AWAITING_CONFIRMATIONS,
      TransactionStatus.AWAITING_EXECUTION,
      TransactionStatus.PENDING,
    ].includes(status)

  const isFailedStatus =
    status &&
    [TransactionStatus.FAILED, TransactionStatus.CANCELLED].includes(status)

  useEffect(() => {
    if (status === TransactionStatus.SUCCESS) {
      handleUpdateState({ ...state, safeTxHash: undefined })
      handleNext()
    }
  }, [handleNext, handleUpdateState, state, status])

  const handleRetry = () => {
    handleUpdateState({ ...state, safeTxHash: undefined })
    handleBack()
  }

  const formattedTokenAmount = formatAmount(
    Number(state.claimedAmount ?? "0"),
    2
  )

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        height: 1,
        gap: 4,
      }}
    >
      <Typography variant="h2">Confirm the Transaction</Typography>
      <Typography variant="subtitle1">You&apos;re claiming:</Typography>
      <Box display="flex" gap={1} mt={-3} alignItems="center">
        <SafeIcon />
        <Typography variant="h5" fontWeight={700}>
          {formattedTokenAmount}
        </Typography>
      </Box>
      {state.isTokenPaused && (
        <Box display="flex" gap={1} mt={-3}>
          <InfoOutlined
            sx={{
              height: "16px",
              width: "16px",
              marginTop: "4px",
              color: ({ palette }) => palette.primary.main,
            }}
          />
          <Typography>The token is initially non-transferable.</Typography>
        </Box>
      )}
      {hasDelegateChanged && state.delegate && (
        <Box>
          <Typography variant="subtitle1">
            Delegating voting power to:
          </Typography>
          <SelectedDelegate delegate={state.delegate} />
        </Box>
      )}
      <Box
        display="flex"
        gap={2}
        padding={2}
        sx={{
          backgroundColor: ({ palette }) => palette.safeGreen.light,
          borderRadius: "6px",
        }}
      >
        {isPendingStatus && <ProgressCircle thickness={2} />}
        <Box>
          <Typography fontWeight={700}>
            Claim tokens and delegate votes.
          </Typography>
          <Typography variant="subtitle1">
            {getStatusMessage(status)}
          </Typography>
          {isFailedStatus && (
            <Button sx={{ mt: 1 }} variant="outlined" onClick={handleRetry}>
              Retry
            </Button>
          )}
        </Box>
      </Box>
      <NavButtons handleBack={handleBack} />
    </Paper>
  )
}

export default Status
