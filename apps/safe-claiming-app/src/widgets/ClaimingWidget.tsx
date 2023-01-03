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
import { useDelegate } from "src/hooks/useDelegate"
import { useDelegatesFile } from "src/hooks/useDelegatesFile"
import useSafeTokenAllocation from "src/hooks/useSafeTokenAllocation"
import { sameAddress } from "src/utils/addresses"
import { formatAmount } from "src/utils/format"
import { SpaceContent } from "src/widgets/styles"

const Title = (props: TypographyProps) => (
  <Typography
    color="text.primary"
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

const ExternalLink = ({ url, label }: { url: string; label: string }) => {
  return (
    <StyledExternalLink
      href={url}
      rel="noreferrer noopener"
      target="_blank"
      variant="subtitle1"
      textAlign="center"
      fontSize="small"
    >
      {label}
      <OpenInNewRounded
        sx={{ width: "0.75em", height: "0.75em" }}
        fontSize="small"
      />
    </StyledExternalLink>
  )
}

const WIDGET_WIDTH = "300px"

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
  const { safe } = useSafeAppsSDK()

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

  const [safeTokenAllocation, , loading] = useSafeTokenAllocation()
  const { vestingData, votingPower } = safeTokenAllocation ?? {}

  const totalClaimed = vestingData?.reduce(
    (prev, current) => prev.add(current.amountClaimed),
    BigNumber.from(0)
  )

  const unredeemedAllocations = vestingData?.some(
    (vesting) => !vesting.isRedeemed
  )

  const currentChainPrefix = safe.chainId === 1 ? "eth" : "gor"
  const claimingSafeAppUrl = `${WEB_APP_URL}/apps?safe=${currentChainPrefix}:${safe.safeAddress}&appUrl=${CLAIMING_APP_URL}`

  const ctaWidget = (
    <>
      <div>
        <Title>Become part of Safe's future</Title>
        <br />
        <Subtitle>
          Help us unlock ownership for everyone by joining the discussions on
          the <ExternalLink url={FORUM_URL} label="SafeDAO Forum" /> and our{" "}
          <ExternalLink url={DISCORD_URL} label="Discord" />.
        </Subtitle>
      </div>
    </>
  )

  const votingPowerWidget = (
    <>
      <div>
        <Title>Your voting power</Title>
        <Link
          href={claimingSafeAppUrl}
          rel="noopener noreferrer"
          target="_blank"
          underline="none"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mb={1}
          >
            <SafeIcon />
            <Typography variant="h5" color="text.primary">
              {votingPower ? (
                formatAmount(Number(ethers.utils.formatEther(votingPower)), 2)
              ) : (
                <Skeleton />
              )}{" "}
            </Typography>
          </Box>
        </Link>
      </div>
      {totalClaimed?.gt(0) ? (
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
              <Link
                href={claimingSafeAppUrl}
                rel="noopener noreferrer"
                target="_blank"
                underline="none"
              >
                <SelectedDelegate delegate={currentDelegate} />
              </Link>
            </Box>
          )}
        </>
      ) : (
        <>
          {unredeemedAllocations && (
            <Subtitle>
              You have unredeemed tokens. Claim any amount before the 27th of
              December or the tokens will be transferred back into the SafeDAO
              treasury.
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

  if (loading) {
    return (
      <Box
        height={`${WIDGET_HEIGHT}px`}
        sx={{
          minWidth: WIDGET_WIDTH,
          maxWidth: WIDGET_WIDTH,
        }}
      >
        <Skeleton variant="rounded" width="100%" height="100%" />
      </Box>
    )
  }

  return (
    <Card elevation={0} sx={{ minWidth: WIDGET_WIDTH, maxWidth: WIDGET_WIDTH }}>
      <SpaceContent sx={{ alignItems: "center" }}>
        {votingPower && votingPower.eq(0) ? ctaWidget : votingPowerWidget}
      </SpaceContent>
    </Card>
  )
}

export default ClaimingWidget
