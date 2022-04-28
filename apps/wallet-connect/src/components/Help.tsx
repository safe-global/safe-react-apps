import { Box } from '@material-ui/core'
import styled from 'styled-components'
import {
  Accordion,
  AccordionSummary,
  IconText,
  AccordionDetails,
  Text,
  Dot,
} from '@gnosis.pm/safe-react-components'

type HelpProps = {
  title: string
  steps: string[]
}

const Help = ({ title, steps }: HelpProps): React.ReactElement => {
  return (
    <StyledAccordion compact>
      <StyledAccordionSummary>
        <StyledIconText iconSize="sm" textSize="xl" iconType="question" text={title} />
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        {steps.map((step, index) => (
          <Box key={index} display="flex" marginBottom={2} alignItems="flex-start">
            <StyledDot color="primary">
              <StyledDotText size="sm">{index + 1}</StyledDotText>
            </StyledDot>
            <Text size="lg">{step}</Text>
          </Box>
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}

const StyledIconText = styled(IconText)`
  svg {
    width: 20px;
    height: 20px;
  }

  p {
    margin-left: 13px;
  }
`

const StyledAccordion = styled(Accordion)`
  && {
    border: 2px solid #e2e3e3;
    .MuiButtonBase-root {
      border: 0;
    }
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  && {
    border: 2px solid #e2e3e3;
  }
`

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    flex-direction: column;
    border-top: 2px solid #e2e3e3;
    &:first-child {
      padding-top: 24px;
    }
    &:last-child {
      padding-bottom: 8px;
    }
  }
`

const StyledDot = styled(Dot)`
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 20px;
  background: #f0efee;
  color: #566976;
`

const StyledDotText = styled(Text)`
  position: absolute;
  font-size: 10px;
`

export default Help
