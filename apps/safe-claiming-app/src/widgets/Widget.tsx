import { Box, Card, styled } from "@mui/material"
import ClaimingWidget from "src/widgets/ClaimingWidget"
import SnapshotWidget from "src/widgets/SnapshotWidget"

const WidgetsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`

const Widget = () => {
  return (
    <Card>
      <WidgetsWrapper sx={{ backgroundColor: "background.main" }}>
        <SnapshotWidget />
        <ClaimingWidget />
      </WidgetsWrapper>
    </Card>
  )
}

export default Widget
