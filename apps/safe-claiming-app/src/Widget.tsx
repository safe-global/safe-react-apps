import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import {
  Box,
  Button,
  type ButtonProps,
  styled,
  Typography,
  type TypographyProps,
} from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"
import { CLAIMING_DATA_URL } from "src/config/constants"
import { useAirdropFile } from "src/hooks/useAirdropFile"
import { useDelegate } from "src/hooks/useDelegate"
import { useDelegatesFile } from "src/hooks/useDelegatesFile"
import { useFetchVestingStatus } from "src/hooks/useFetchVestingStatus"
import { useTokenBalance } from "src/hooks/useTokenBalance"
import { sameAddress } from "src/utils/addresses"
import { formatAmount } from "src/utils/format"

const SpaceContent = styled("div")`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = (props: TypographyProps) => (
  <Typography
    color="primary.main"
    style={{ fontWeight: "bold", textAlign: "center" }}
  >
    {props.children}
  </Typography>
)

const Subtitle = (props: TypographyProps) => (
  <Typography
    variant="subtitle2"
    color="primary.light"
    style={{ marginBottom: "16px", textAlign: "center" }}
  >
    {props.children}
  </Typography>
)

const StyledButton = (props: ButtonProps) => (
  <Button
    size="large"
    onClick={props.onClick}
    variant="contained"
    disableElevation
  >
    {props.children}
  </Button>
)

const Widget = () => {
  const [delegates] = useDelegatesFile()
  const delegateAddressFromContract = useDelegate()
  const balance = useTokenBalance()
  const { safe } = useSafeAppsSDK()

  const [vestings] = useAirdropFile()
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

  const [userVestingStatus] = useFetchVestingStatus(
    userVesting?.vestingId,
    userVesting?.contract
  )

  const [ecosystemVestingStatus] = useFetchVestingStatus(
    ecosystemVesting?.vestingId,
    ecosystemVesting?.contract
  )

  const [investorVestingStatus] = useFetchVestingStatus(
    investorVesting?.vestingId,
    investorVesting?.contract
  )

  const totalClaimed = BigNumber.from(userVestingStatus?.amountClaimed || 0)
    .add(ecosystemVestingStatus?.amountClaimed || 0)
    .add(investorVestingStatus?.amountClaimed || 0)

  const votingPower = useMemo(() => {
    if (totalAllocation.gt(0) && totalClaimed.gt(0) && balance.gt(0)) {
      return totalAllocation.sub(totalClaimed).add(balance)
    }
    return BigNumber.from(0)
  }, [balance, totalAllocation, totalClaimed])

  const handleClickClaim = () => {
    const url = `${window.location.ancestorOrigins[0]}/apps?safe=${
      safe.chainId === 1 ? "eth" : "gor"
    }:${safe.safeAddress}&appUrl=${CLAIMING_DATA_URL}`

    // @ts-ignore
    window.top.location.href = url
  }

  const ctaWidget = (
    <SpaceContent>
      <div>
        <Title>Become the part of Safe future!</Title>
        <Subtitle>
          Holding $SAFE is required to participate in governance.
        </Subtitle>
      </div>
      <StyledButton>Buy Tokens</StyledButton>
    </SpaceContent>
  )

  const votingPowerWidget = (
    <SpaceContent>
      <div>
        <Title>Your voting power</Title>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          mb={1}
        >
          <SafeIcon />
          <Typography variant="h5">
            {formatAmount(Number(ethers.utils.formatEther(votingPower)), 2)}{" "}
          </Typography>
        </Box>
      </div>
      {totalClaimed.gt(0) ? (
        <>
          <Subtitle>
            You've already claimed{" "}
            {formatAmount(Number(ethers.utils.formatEther(totalClaimed)), 2)}{" "}
            SAFE
          </Subtitle>
          {currentDelegate && (
            <Box width={1}>
              <Typography variant="caption" marginBottom={1}>
                Delegated to
              </Typography>
              <SelectedDelegate delegate={currentDelegate} onClick={() => {}} />
            </Box>
          )}
        </>
      ) : (
        <>
          <Subtitle>
            Claim your tokens to start participating in voting
          </Subtitle>
          <StyledButton onClick={handleClickClaim}>
            Claim And Delegate
          </StyledButton>
        </>
      )}
    </SpaceContent>
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="300px"
      p={3}
      sx={{ backgroundColor: "background.paper" }}
    >
      {votingPower.eq(0) ? ctaWidget : votingPowerWidget}
    </Box>
  )
}

export default Widget
