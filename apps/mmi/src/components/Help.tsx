import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from '@mui/material'

type HelpProps = {
  title: string
  steps: string[]
}

const Help = ({ title, steps }: HelpProps): React.ReactElement => {
  return (
    <StyledAccordion elevation={0}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <HelpOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
        <Typography variant="body2" ml={2}>
          {title}
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        {steps.map((step, index) => (
          <Box key={index} display="flex" marginBottom={2} alignItems="flex-start">
            <StyledDot color="primary">
              <Typography sx={{ fontSize: '10px' }}>{index + 1}</Typography>
            </StyledDot>
            <Typography variant="body2">{step}</Typography>
          </Box>
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}

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

const StyledDot = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  background: #f0efee;
  color: #566976;
`

export default Help
