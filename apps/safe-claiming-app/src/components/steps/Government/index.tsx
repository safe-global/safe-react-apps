import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material"
import Box from "@mui/system/Box"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { NavButtons } from "src/components/helpers/NavButtons"

type Props = {
  handleBack: () => void
  handleNext: () => void
}

const InfoAccordion = ({
  summaryText,
  details,
}: {
  summaryText: string
  details: JSX.Element | string
}) => {
  return (
    <Accordion
      sx={{
        borderRadius: "6px",
        marginBottom: 2,
        border: "1px solid #DCDEE0",
        boxShadow: "none",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          fontWeight={700}
          component="li"
          sx={{
            position: "relative",
            marginLeft: "24px",
            listStyleType: "none",
            "&::before": {
              content: '" "',
              borderRadius: "2px",
              position: "absolute",
              backgroundColor: ({ palette }) => palette.primary.main,
              minWidth: "6px",
              minHeight: "6px",
              top: "9px",
              left: "-24px",
            },
          }}
        >
          {summaryText}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{details}</AccordionDetails>
    </Accordion>
  )
}

const Government = ({ handleNext, handleBack }: Props) => {
  return (
    <Paper elevation={0} sx={{ padding: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        marginBottom={3}
      >
        <Typography fontWeight={700} variant="h4" maxWidth={"400px"}>
          What exactly is the Safe token and what does it govern?
        </Typography>
        <Typography variant="subtitle1">Step 1 of 3</Typography>
      </Box>
      <Typography mb={3}>
        $SAFE is an ERC-20 governance token that stewards infrastructure
        components of the Safe ecosystem, including:
      </Typography>

      <InfoAccordion
        summaryText="Safe Protocol"
        details={
          <ul style={{ listStyleType: "none" }}>
            <Typography component="li" mb={1}>
              Safe Deployments (core smart contract deployments across multiple
              networks)
            </Typography>
            <Typography component="li">
              Curation of “trusted lists” (token lists, dApp lists, module
              lists)
            </Typography>
          </ul>
        }
      />

      <InfoAccordion
        summaryText="Interfaces"
        details={
          <ul style={{ listStyleType: "none" }}>
            <Typography component="li" mb={1}>
              Decentralized hosting of a Safe frontend using the safe.eth domain
            </Typography>
            <Typography component="li">
              Decentralized hosting of governance frontends
            </Typography>
          </ul>
        }
      />

      <InfoAccordion
        summaryText="On-chain assets"
        details={
          <ul style={{ listStyleType: "none" }}>
            <Typography component="li" mb={1}>
              ENS names
            </Typography>
            <Typography component="li" mb={1}>
              Outstanding Safe token supply
            </Typography>
            <Typography component="li">
              Other Safe Treasury assets (NFTs, tokens, etc.)
            </Typography>
          </ul>
        }
      />

      <InfoAccordion
        summaryText="Tokenomics"
        details={
          <ul style={{ listStyleType: "none" }}>
            <Typography component="li" mb={1}>
              Ecosystem reward programs
            </Typography>
            <Typography component="li" mb={1}>
              User rewards
            </Typography>
            <Typography component="li" mb={1}>
              Value capture
            </Typography>
            <Typography component="li">Future token utility</Typography>
          </ul>
        }
      />

      <NavButtons handleBack={handleBack} handleNext={handleNext} />
    </Paper>
  )
}

export default Government
