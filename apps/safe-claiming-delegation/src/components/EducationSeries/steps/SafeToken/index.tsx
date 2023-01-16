import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  Grid,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { ReactElement } from 'react'

import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { useEducationSeriesStepper } from '@/components/EducationSeries'

import css from './styles.module.css'

const InfoAccordion = ({ summaryText, details }: { summaryText: string; details: string[] }) => {
  return (
    <Accordion className={css.accordion} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={css.summary}>
        <Typography className={css.summaryText}>{summaryText}</Typography>
      </AccordionSummary>

      <AccordionDetails className={css.details}>
        <List className={css.list}>
          {details.map(detail => (
            <ListItem key={detail}>{detail}</ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

const SafeToken = (): ReactElement => {
  const { onBack, onNext } = useEducationSeriesStepper()

  return (
    <Grid container px={6} pt={5} pb={4}>
      <Grid item xs={12} mb={3}>
        <StepHeader title="What exactly is the Safe token and what does it govern?" />
      </Grid>

      <Typography mb={3}>
        $SAFE is an ERC-20 governance token that stewards infrastructure components of the Safe
        ecosystem, including:
      </Typography>

      <InfoAccordion
        summaryText="Safe Protocol"
        details={[
          'Safe Deployments (core smart contract deployments across multiple networks)',
          'Curation of “trusted lists” (token lists, dApp lists, module lists)',
        ]}
      />

      <InfoAccordion
        summaryText="Interfaces"
        details={[
          'Decentralized hosting of a Safe frontend using the safe.eth domain',
          'Decentralized hosting of governance frontends',
        ]}
      />

      <InfoAccordion
        summaryText="On-chain assets"
        details={[
          'ENS names',
          'Outstanding Safe token supply',
          'Other Safe Treasury assets (NFTs, tokens, etc.)',
        ]}
      />

      <InfoAccordion
        summaryText="Tokenomics"
        details={[
          'Ecosystem reward programs',
          'User rewards',
          'Value capture',
          'Future token utility',
        ]}
      />

      <NavButtons onBack={onBack} onNext={onNext} />
    </Grid>
  )
}

export default SafeToken
