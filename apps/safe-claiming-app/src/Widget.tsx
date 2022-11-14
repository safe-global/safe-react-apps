import { Box, Typography } from "@mui/material"
import { useMemo } from "react"
import { AppState } from "src/App"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"
import { useDelegate } from "src/hooks/useDelegate"
import { useDelegatesFile } from "src/hooks/useDelegatesFile"
import { sameAddress } from "src/utils/addresses"

type Props = {
  state?: AppState
}

const Widget = ({ state }: Props) => {
  const [delegates] = useDelegatesFile()
  const delegateAddressFromContract = useDelegate()

  const currentDelegate = useMemo(() => {
    if (delegateAddressFromContract) {
      const registeredDelegateFromData = delegates.find((entry) =>
        sameAddress(entry.address, delegateAddressFromContract)
      )
      return (
        registeredDelegateFromData || { address: delegateAddressFromContract }
      )
    }
  }, [delegateAddressFromContract, delegates])

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="300px"
      p={3}
      sx={{ backgroundColor: "background.paper" }}
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
      {currentDelegate && (
        <Box width={1}>
          <Typography variant="caption" marginBottom={1}>
            Delegated to
          </Typography>
          <SelectedDelegate delegate={currentDelegate} onClick={() => {}} />
        </Box>
      )}
    </Box>
  )
}

export default Widget
