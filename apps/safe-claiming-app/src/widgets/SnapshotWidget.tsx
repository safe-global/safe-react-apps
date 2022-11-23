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
import useSafeSnapshot, {
  type SnapshotProposal,
} from "src/hooks/useSafeSnapshot"
import { SpaceContent } from "src/widgets/styles"

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
  width: 100%;
  display: grid;
  grid-gap: 4px;
  align-items: center;
  text-decoration: none;
  padding: 16px;
  border: 1px solid;
  border-radius: 6px;
  grid-template-columns: 80px minmax(auto, 9fr) 1fr 1fr;
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
  border-radius: 6px;
  padding: 0px 8px;
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
          borderColor: "primary.light",
          "&:hover": {
            borderColor: "primary.main",
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
            "& .MuiChip-root": {
              color: "background.paper",
            },
            gridArea: "status",
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
  const SNAPSHOT_LINK = "https://snapshot.org/#/safe.eth"
  const FORUM_LINK = "https://forum.safe.global"
  const PROPOSAL_AMOUNT = 3

  const [proposals, loading] = useSafeSnapshot(PROPOSAL_AMOUNT)

  return (
    <Card sx={{ borderRadius: "4px" }}>
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
          >
            View all <OpenInNewRounded fontSize="small" />
          </StyledExternalLink>
          <StyledExternalLink
            href={FORUM_LINK}
            rel="noreferrer noopener"
            target="_blank"
            variant="subtitle1"
          >
            SafeDAO Forum <OpenInNewRounded fontSize="small" />
          </StyledExternalLink>
        </Box>
      </SpaceContent>
    </Card>
  )
}

export default SnapshotWidget
