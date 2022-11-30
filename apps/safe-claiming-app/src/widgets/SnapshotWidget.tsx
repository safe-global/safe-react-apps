import { OpenInNewRounded } from "@mui/icons-material"
import {
  Box,
  Chip,
  Link,
  Typography,
  Skeleton,
  styled,
  Card,
} from "@mui/material"
import { FORUM_URL } from "src/config/constants"
import useSafeSnapshot, {
  type SnapshotProposal,
} from "src/hooks/useSafeSnapshot"
import { useSafeSnapshotSpace } from "src/hooks/useSnapshotSpace"
import { SpaceContent } from "src/widgets/styles"
import palette from "../config/colors"

export const _getProposalNumber = (title: string): string => {
  // Find anything that matches "SEP #n"
  const SEP_REGEX = /SEP\s#\d+/g
  return title.match(SEP_REGEX)?.[0] || ""
}

export const _getProposalTitle = (title: string): string => {
  // Find anything after "] " or ": "
  const TITLE_REGEX = /(\]|:) (.*)/
  return title.match(TITLE_REGEX)?.at(-1) || ""
}

const Proposal = styled("a")`
  height: 47px;
  width: 100%;
  display: grid;
  grid-gap: 4px;
  align-items: center;
  text-decoration: none;
  padding: 0px 16px;
  border: 1px solid;
  border-radius: 6px;
  grid-template-columns: auto minmax(auto, 9fr) 1fr 1fr;
  grid-template-areas: "number title title title title title title title title title status link";
`

const StyledChip = styled(Chip)`
  border-radius: 20px;
  min-width: 68px;
  text-align: center;
  height: 23px;
  font-weight: bold;
`

const StyledNumber = styled(Box)`
  height: 18px;
  font-size: 13px;
  border-radius: 6px;
  padding: 0px 6px;
  white-space: nowrap;
  margin-right: 12px;
`

const StyledExternalLink = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 700;
  gap: 8px;
  text-decoration: none;
`

const SnapshotProposals = ({
  proposals,
  snapshotLink,
}: {
  proposals: SnapshotProposal[]
  snapshotLink: string
}) => (
  <>
    {proposals?.map((proposal) => (
      <Proposal
        href={`${snapshotLink}/proposal/${proposal.id}`}
        key={proposal.id}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          borderColor: "border.light",
          "&:hover": {
            borderColor: "border.main",
          },
        }}
      >
        <StyledNumber
          sx={{
            color: "primary.main",
            backgroundColor: "border.light",
            gridArea: "number",
          }}
        >
          {_getProposalNumber(proposal.title)}
        </StyledNumber>
        <Box gridArea="title" overflow="hidden">
          <Typography
            overflow="hidden"
            color="text.primary"
            fontSize={14}
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {_getProposalTitle(proposal.title)}
          </Typography>
        </Box>
        <StyledChip
          label={proposal.state}
          sx={{
            gridArea: "status",
            color: palette.background.paper,
            backgroundColor:
              proposal.state === "active" ? "success.main" : "#743EE4",
          }}
        />
        <Box gridArea="link" display="flex" alignItems="center" ml="12px">
          <OpenInNewRounded fontSize="small" sx={{ color: "text.primary" }} />
        </Box>
      </Proposal>
    ))}
  </>
)

const SnapshotWidget = () => {
  const snapshotSpace = useSafeSnapshotSpace()

  const SNAPSHOT_LINK = `https://snapshot.org/#/${snapshotSpace}`
  const PROPOSAL_AMOUNT = 3

  const [proposals, loading] = useSafeSnapshot(PROPOSAL_AMOUNT)

  return (
    <Card elevation={0} sx={{ flexGrow: 1 }}>
      <SpaceContent>
        <div>
          <Typography
            component="h2"
            variant="subtitle1"
            marginBottom="0"
            fontWeight="bold"
            color="text.primary"
          >
            Latest proposals
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            width={1}
            padding="16px 0"
          >
            {loading || !proposals ? (
              Array.from(Array(PROPOSAL_AMOUNT).keys()).map((key) => (
                <Skeleton
                  key={key}
                  variant="rounded"
                  height="47px"
                  width="100%"
                />
              ))
            ) : (
              <SnapshotProposals
                proposals={proposals}
                snapshotLink={SNAPSHOT_LINK}
              />
            )}
          </Box>
        </div>
        <Box display="flex" gap={4}>
          <StyledExternalLink
            href={SNAPSHOT_LINK}
            rel="noreferrer noopener"
            target="_blank"
            variant="subtitle1"
            textAlign="center"
          >
            View all <OpenInNewRounded fontSize="small" />
          </StyledExternalLink>
          <StyledExternalLink
            href={FORUM_URL}
            rel="noreferrer noopener"
            target="_blank"
            variant="subtitle1"
            textAlign="center"
          >
            SafeDAO Forum <OpenInNewRounded fontSize="small" />
          </StyledExternalLink>
        </Box>
      </SpaceContent>
    </Card>
  )
}

export default SnapshotWidget
