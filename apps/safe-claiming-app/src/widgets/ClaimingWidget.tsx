import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import {
  Box,
  Button,
  type ButtonProps,
  Typography,
  type TypographyProps,
  Link,
  Skeleton,
  Paper,
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
import { SpaceContent } from "src/widgets/styles"

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

const ClaimingWidget = () => {
  const [delegates] = useDelegatesFile()
  const delegateAddressFromContract = useDelegate()
  const [balance, , balanceLoading] = useTokenBalance()
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

  const [userVestingStatus, , userVestingLoading] = useFetchVestingStatus(
    userVesting?.vestingId,
    userVesting?.contract
  )

  const [ecosystemVestingStatus, , ecosystemVestingLoading] =
    useFetchVestingStatus(
      ecosystemVesting?.vestingId,
      ecosystemVesting?.contract
    )

  const [investorVestingStatus, , investorVestingLoading] =
    useFetchVestingStatus(investorVesting?.vestingId, investorVesting?.contract)

  const totalClaimed = BigNumber.from(userVestingStatus?.amountClaimed || 0)
    .add(ecosystemVestingStatus?.amountClaimed || 0)
    .add(investorVestingStatus?.amountClaimed || 0)

  const votingPower = totalAllocation.add(balance || 0).sub(totalClaimed)

  const unredeemedAllocations =
    (!userVestingStatus?.isRedeemed &&
      BigNumber.from(userVesting?.amount || 0).gt(0)) ||
    (!ecosystemVestingStatus?.isRedeemed &&
      BigNumber.from(ecosystemVesting?.amount || 0).gt(0))

  const ctaWidget = (
    <>
      <div>
        <Title>Become the part of Safe future!</Title>
        <br />
        <Subtitle>
          You will be able to buy $SAFE once the token transferability is
          enabled.
        </Subtitle>
      </div>
      <StyledButton disabled>Buy Tokens</StyledButton>
    </>
  )

  const votingPowerWidget = (
    <>
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
          {unredeemedAllocations && (
            <Subtitle>
              You have unredeemed tokens. Redeem them by 27th Dec or they will
              be transfered back into the treasury.
            </Subtitle>
          )}
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
    </>
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
    <Paper>
      <SpaceContent sx={{ alignItems: "center" }}>
        {votingPower.eq(0) ? ctaWidget : votingPowerWidget}
      </SpaceContent>
    </Paper>
  )
}

export default ClaimingWidget
