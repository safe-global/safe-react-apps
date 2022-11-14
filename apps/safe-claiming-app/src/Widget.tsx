import { Box, Typography } from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { AppState } from "src/App"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"
import { useAirdropFile } from "src/hooks/useAirdropFile"
import { useDelegate } from "src/hooks/useDelegate"
import { useDelegatesFile } from "src/hooks/useDelegatesFile"
import { useFetchVestingStatus } from "src/hooks/useFetchVestingStatus"
import { useTokenBalance } from "src/hooks/useTokenBalance"
import { sameAddress } from "src/utils/addresses"
import { formatAmount } from "src/utils/format"

const Widget = () => {
  const [delegates] = useDelegatesFile()
  const delegateAddressFromContract = useDelegate()
  const balance = useTokenBalance()

  const [vestings, isVestingLoading, vestingFileError] = useAirdropFile()
  const [userVesting, ecosystemVesting, investorVesting] = vestings

  const totalAllocation = BigNumber.from(userVesting?.amount || 0)
    .add(ecosystemVesting?.amount || 0)
    .add(investorVesting?.amount || 0)

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

  // fetch the claimed amount
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

  const totalClaimed = BigNumber.from(userVestingStatus?.amountClaimed || 0)
    .add(ecosystemVestingStatus?.amountClaimed || 0)
    .add(investorVestingStatus?.amountClaimed || 0)

  const votingPower = totalAllocation.add(balance).sub(totalClaimed)

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
          {formatAmount(Number(ethers.utils.formatEther(votingPower)), 2)}{" "}
        </Typography>
      </Box>

      <Typography variant="subtitle2" mb="22px">
        You've already claimed{" "}
        {formatAmount(Number(ethers.utils.formatEther(totalClaimed)), 2)} SAFE
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
