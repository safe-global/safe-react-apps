import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material"
import { ReactComponent as DelegatesIcon } from "src/assets/images/delegates.svg"
import { ReactComponent as CustomAddressIcon } from "src/assets/images/user-plus.svg"

export const DelegateSwitch = ({
  isCustomDelegation,
  setIsCustomDelegation,
}: {
  isCustomDelegation: boolean
  setIsCustomDelegation: (isCustom: boolean) => void
}) => {
  return (
    <Grid container justifyContent="space-between" flexWrap="nowrap" gap={2}>
      <Grid item xs={6} position="relative">
        {!isCustomDelegation && (
          <CheckCircleRoundedIcon
            height={22}
            width={22}
            color="primary"
            sx={{
              position: "absolute",
              top: "-10px",
              left: "-10px",
              background: "white",
            }}
          />
        )}
        <Card
          variant="outlined"
          elevation={0}
          sx={
            !isCustomDelegation
              ? { borderColor: ({ palette }) => palette.primary.main }
              : undefined
          }
        >
          <CardActionArea onClick={() => setIsCustomDelegation(false)}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "left",
                }}
              >
                <DelegatesIcon />
                <Typography>Delegate to a Safe Guardian</Typography>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={6} position="relative">
        {isCustomDelegation && (
          <CheckCircleRoundedIcon
            height={22}
            width={22}
            color="primary"
            sx={{
              position: "absolute",
              top: "-10px",
              left: "-10px",
              background: "white",
            }}
          />
        )}
        <Card
          variant="outlined"
          elevation={0}
          sx={
            isCustomDelegation
              ? { borderColor: ({ palette }) => palette.primary.main }
              : undefined
          }
        >
          <CardActionArea onClick={() => setIsCustomDelegation(true)}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "left",
                }}
              >
                <CustomAddressIcon />
                <Typography>Custom address</Typography>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
}
