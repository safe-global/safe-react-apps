import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material"
import Box from "@mui/system/Box"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { NavButtons } from "src/components/helpers/NavButtons"
import InfoOutlined from "@mui/icons-material/InfoOutlined"

type Props = {
  handleBack: () => void
  handleNext: () => void
}

const InfoAccordion = ({
  summaryText,
  details,
}: {
  summaryText: string
  details: string[]
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
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ "&.Mui-expanded": { minHeight: "48px" } }}
      >
        <Typography
          fontWeight={700}
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
      <AccordionDetails sx={{ pt: 0 }}>
        <List sx={{ pt: 0, "& .MuiListItem-root": { p: "4px 0 4px 24px" } }}>
          {details.map((detail: string) => (
            <ListItem key={detail}>{detail}</ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

const Government = ({ handleNext, handleBack }: Props) => {
  return (
    <Paper elevation={0} sx={{ padding: 6 }}>
      <Typography fontWeight={700} variant="h4" maxWidth={"400px"} mb={3}>
        What exactly is the Safe token and what does it govern?
      </Typography>
      <Box display="flex" gap={1} mb={3}>
        <InfoOutlined
          sx={{
            height: "16px",
            width: "16px",
            marginTop: "4px",
            color: ({ palette }) => palette.secondary.main,
          }}
        />
        <Typography variant="subtitle1">
          Safe Token is initially non-transferable.
        </Typography>
      </Box>
      <Typography mb={3}>
        $SAFE is an ERC-20 governance token that stewards infrastructure
        components of the Safe ecosystem, including:
      </Typography>

      <InfoAccordion
        summaryText="Safe Protocol"
        details={[
          "Safe Deployments (core smart contract deployments across multiple networks)",
          "Curation of “trusted lists” (token lists, dApp lists, module lists)",
        ]}
      />

      <InfoAccordion
        summaryText="Interfaces"
        details={[
          "Decentralized hosting of a Safe frontend using the safe.eth domain",
          "Decentralized hosting of governance frontends",
        ]}
      />

      <InfoAccordion
        summaryText="On-chain assets"
        details={[
          "ENS names",
          "Outstanding Safe token supply",
          "Other Safe Treasury assets (NFTs, tokens, etc.)",
        ]}
      />

      <InfoAccordion
        summaryText="Tokenomics"
        details={[
          "Ecosystem reward programs",
          "User rewards",
          "Value capture",
          "Future token utility",
        ]}
      />

      <NavButtons handleBack={handleBack} handleNext={handleNext} />
    </Paper>
  )
}

export default Government
