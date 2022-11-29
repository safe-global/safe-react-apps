import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { OpenInNewRounded } from "@mui/icons-material"
import {
  Box,
  Button,
  type ButtonProps,
  Typography,
  type TypographyProps,
  Link,
  Skeleton,
  Card,
  styled,
} from "@mui/material"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { ReactComponent as SafeIcon } from "src/assets/images/safe-token.svg"
import { SelectedDelegate } from "src/components/steps/Claim/SelectedDelegate"
import {
  CLAIMING_APP_URL,
  DISCORD_URL,
  FORUM_URL,
  WEB_APP_URL,
} from "src/config/constants"
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
    style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}
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

const StyledExternalLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  gap: 4px;
  text-decoration: none;
`

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

  const currentChainPrefix = safe.chainId === 1 ? "eth" : "gor"
  const claimingSafeAppUrl = `${WEB_APP_URL}/apps?safe=${currentChainPrefix}:${safe.safeAddress}&appUrl=${CLAIMING_APP_URL}`

  const ctaWidget = (
    <>
      <div>
        <Title>Become part of Safe's future</Title>
        <br />
        <Subtitle>
          Help us unlocking ownership for everyone by joining the discussions in
          the{" "}
          <StyledExternalLink
            href={FORUM_URL}
            rel="noreferrer noopener"
            target="_blank"
            variant="subtitle1"
            textAlign="center"
            fontSize="small"
          >
            SafeDAO Forum
            <OpenInNewRounded
              sx={{ width: "0.75em", height: "0.75em" }}
              fontSize="small"
            />
          </StyledExternalLink>{" "}
          and our
          <StyledExternalLink
            href={DISCORD_URL}
            rel="noreferrer noopener"
            target="_blank"
            variant="subtitle1"
            textAlign="center"
            fontSize="small"
          >
            Discord
            <OpenInNewRounded
              sx={{ width: "0.75em", height: "0.75em" }}
              fontSize="small"
            />
          </StyledExternalLink>
          .
        </Subtitle>
      </div>
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
          <Typography variant="h5" color="text.primary">
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
              <Typography
                variant="caption"
                color="text.primary"
                marginBottom={1}
              >
                Delegated to
              </Typography>
              <SelectedDelegate delegate={currentDelegate} />
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
            href={claimingSafeAppUrl}
            rel="noopener noreferrer"
            target="_blank"
            display="inline-flex"
            alignItems="center"
            underline="none"
          >
            <StyledButton>Claim and delegate</StyledButton>
          </Link>
        </>
      )}
    </>
  )

  const onChainRequestsLoading =
    userVestingLoading ||
    ecosystemVestingLoading ||
    investorVestingLoading ||
    balanceLoading
  if (onChainRequestsLoading) {
    return (
      <Box
        height={`${WIDGET_HEIGHT}px`}
        sx={{
          minWidth: "300px",
          maxWidth: "300px",
        }}
      >
        <Skeleton variant="rounded" width="100%" height="100%" />
      </Box>
    )
  }

  return (
    <Card elevation={0} sx={{ minWidth: "300px", maxWidth: "300px" }}>
      <SpaceContent sx={{ alignItems: "center" }}>
        {votingPower.eq(0) ? ctaWidget : votingPowerWidget}
      </SpaceContent>
    </Card>
  )
}

export default ClaimingWidget
