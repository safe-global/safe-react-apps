import { ShieldOutlined } from "@mui/icons-material"
import {
  Grid,
  Paper,
  Typography,
  Tooltip,
  Badge,
  styled,
  useTheme,
} from "@mui/material"
import { ethers } from "ethers"
import { formatAmount } from "src/utils/format"
import { Odometer } from "./Odometer/Odometer"
import { ReactComponent as SingleGreenTile } from "src/assets/images/single-green-tile.svg"
import { ReactComponent as DoubleGreenTile } from "src/assets/images/double-green-tile.svg"
import InfoOutlined from "@mui/icons-material/InfoOutlined"

const StyledSingleTile = styled(SingleGreenTile)`
  position: absolute;
  top: 0px;
  right: 80px;
`

const StyledDoubleTile = styled(DoubleGreenTile)`
  position: absolute;
  bottom: 15px;
  right: 0px;
`
const StyledBadge = styled(Badge)<{ dotColor: string }>`
  & .MuiBadge-badge {
    right: 4px;
    bottom: 5px;
    height: 6px;
    min-width: 6px;
    background-color: ${(props) => props.dotColor};
  }
`

const AmountDisplay = ({ amount }: { amount: string }) => {
  const amountInDecimal = ethers.utils.formatEther(amount)
  return (
    <Typography
      variant="h3"
      variantMapping={{
        h3: "span",
      }}
      lineHeight="2em"
      fontWeight={700}
      display="inline-flex"
      gap="4px"
      alignItems={"center"}
    >
      <Odometer value={Number(amountInDecimal)} decimals={2} /> SAFE
    </Typography>
  )
}

export const ClaimCard = ({
  isGuardian,
  ecosystemAmount,
  totalAmount,
  variant,
}: {
  isGuardian: boolean
  ecosystemAmount: string
  totalAmount: string
  variant: "claimable" | "vesting"
}) => {
  const { palette } = useTheme()
  const ecosystemAmountInDecimals = formatAmount(
    Number(ethers.utils.formatEther(ecosystemAmount)),
    2
  )

  const isClaimable = variant === "claimable"

  const backgroundColor = isClaimable
    ? palette.primary.main
    : palette.background.default

  const color = isClaimable ? palette.background.default : palette.text.primary

  const dotColor = isClaimable ? "white" : "#12ff80"

  return (
    <Grid item xs={12} md={6}>
      <Paper
        elevation={0}
        sx={{
          padding: 3,
          backgroundColor,
          color,
          position: "relative",
        }}
      >
        {isClaimable && <StyledSingleTile />}
        {isClaimable && <StyledDoubleTile />}

        <Typography marginBottom={2} fontWeight={700}>
          {isClaimable ? "Claim now" : "Claim in future (vesting)"}
          {!isClaimable && (
            <Tooltip
              title={
                <Typography>
                  Linear vesting over 4 years from a starting date of 27.09.2022
                </Typography>
              }
              arrow
              placement="top"
            >
              <InfoOutlined
                sx={{
                  height: "16px",
                  width: "16px",
                  marginBottom: "-2px",
                  marginLeft: 1,
                  color: ({ palette }) => palette.secondary.main,
                }}
              />
            </Tooltip>
          )}
        </Typography>
        <Grid container direction="column">
          <Grid item display="flex" gap={1} alignItems="center">
            <Typography variant="subtitle2" color={color}>
              Total
            </Typography>
            <Tooltip
              title={
                <Typography>
                  {isGuardian ? (
                    <>
                      This includes a Safe Guardian allocation of
                      <strong> {ecosystemAmountInDecimals} SAFE</strong>
                    </>
                  ) : (
                    "Not eligible for Safe Guardian allocation. Contribute to the community to become a Safe Guardian."
                  )}
                </Typography>
              }
              arrow
              placement="top"
            >
              <StyledBadge
                variant="dot"
                dotColor={dotColor}
                invisible={!isGuardian}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <ShieldOutlined
                  sx={{
                    height: "16px",
                    width: "16px",
                  }}
                />
              </StyledBadge>
            </Tooltip>
          </Grid>
          <Grid item display="flex" alignItems="center">
            <AmountDisplay amount={totalAmount} />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}
