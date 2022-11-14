import { Box, Typography } from "@mui/material"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"

const Widget = () => {
  const delegate = { address: "0x123" }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={1}
      sx={{
        height: "300px",
        background: ({ palette }) => palette.background.paper,
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} color="primary.main">
        Voting power{" "}
      </Typography>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <SafeIcon />
        <Typography variant="h5">
          {/* TODO: fetch total allocation */}
          {/* {formatAmount(Number(ethers.utils.formatEther(totalAllocation)), 2)}{" "} */}
          528.69
        </Typography>
      </Box>

      <Typography variant="subtitle2" mb="22px">
        {/* TODO: fetch claimed value */}
        You've already claimed 342.32 SAFE
      </Typography>
      {delegate && (
        <Box width={1}>
          <Typography variant="caption" marginBottom={1}>
            Delegated to
          </Typography>
          <SelectedDelegate delegate={delegate} onClick={() => {}} />
        </Box>
      )}
    </Box>
  )
}

export default Widget
