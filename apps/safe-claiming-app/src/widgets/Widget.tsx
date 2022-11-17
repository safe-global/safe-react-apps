import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import {
  Box,
  Button,
  type ButtonProps,
  styled,
  Typography,
  type TypographyProps,
  Link,
  Skeleton,
} from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"
import { CLAIMING_APP_URL } from "src/config/constants"
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
    fullWidth
    disabled={props.disabled}
  >
    {props.children}
  </Button>
)

const WIDGET_HEIGHT = 300

const ClaimingApp = () => {
  const [delegates] = useDelegatesFile()
  const delegateAddressFromContract = useDelegate()
  const [balance, balanceLoading] = useTokenBalance()
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

  const [userVestingStatus, userVestingLoading] = useFetchVestingStatus(
    userVesting?.vestingId,
    userVesting?.contract
  )

  const [ecosystemVestingStatus, ecosystemVestingLoading] =
    useFetchVestingStatus(
      ecosystemVesting?.vestingId,
      ecosystemVesting?.contract
    )

  const [investorVestingStatus, investorVestingLoading] = useFetchVestingStatus(
    investorVesting?.vestingId,
    investorVesting?.contract
  )

  const totalClaimed = BigNumber.from(userVestingStatus?.amountClaimed || 0)
    .add(ecosystemVestingStatus?.amountClaimed || 0)
    .add(investorVestingStatus?.amountClaimed || 0)

  const votingPower = useMemo(() => {
    if (totalAllocation.gt(0) && totalClaimed.gt(0) && balance?.gt(0)) {
      return totalAllocation.sub(totalClaimed).add(balance)
    }
    return BigNumber.from(0)
  }, [balance, totalAllocation, totalClaimed])

  const ctaWidget = (
    <SpaceContent>
      <div>
        <Title>Become the part of Safe future!</Title>
        <br />
        <Subtitle>
          You will be able to buy $SAFE once the token transferability is
          enabled.
        </Subtitle>
      </div>
      <StyledButton disabled>Buy Tokens</StyledButton>
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
          <Link
            href={`${window.location.ancestorOrigins[0]}/apps?safe=${
              safe.chainId === 1 ? "eth" : "gor"
            }:${safe.safeAddress}&appUrl=${CLAIMING_APP_URL}`}
            rel="noopener noreferrer"
            target="_blank"
            display="inline-flex"
            alignItems={"center"}
            underline="none"
          >
            <StyledButton>Claim And Delegate</StyledButton>
          </Link>
        </>
      )}
    </SpaceContent>
  )

  const onchainRequestsLoading =
    userVestingLoading ||
    ecosystemVestingLoading ||
    investorVestingLoading ||
    balanceLoading
  if (onchainRequestsLoading) {
    return (
      <Box height={`${WIDGET_HEIGHT}px`}>
        <Skeleton variant="rounded" width="100%" height="100%" />
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height={`${WIDGET_HEIGHT}px`}
      p={3}
      sx={{ backgroundColor: "background.paper" }}
    >
      {votingPower.eq(0) ? ctaWidget : votingPowerWidget}
    </Box>
  )
}

export default ClaimingApp
