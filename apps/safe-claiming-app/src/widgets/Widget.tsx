import { Box, Card, styled } from "@mui/material"
import ClaimingWidget from "src/widgets/ClaimingWidget"
import SnapshotWidget from "src/widgets/SnapshotWidget"

const WidgetsWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  gap: "24px",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}))

const Widget = () => {
  return (
    <Card>
      <WidgetsWrapper>
        <SnapshotWidget />
        <ClaimingWidget />
      </WidgetsWrapper>
    </Card>
  )
}

export default Widget
