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
    <Accordion elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <HelpOutlineOutlinedIcon color="border" sx={{ fontSize: '20px' }} />
        <Typography variant="body2" ml={2}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {steps.map((step, index) => (
          <Box key={index} display="flex" marginBottom={2} alignItems="flex-start">
            <StyledDot color="primary">
              <Typography sx={{ fontSize: '10px' }}>{index + 1}</Typography>
            </StyledDot>
            <Typography variant="body2">{step}</Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

const StyledDot = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  background: ${({ theme }) => theme.palette.background.main};
  color: ${({ theme }) => theme.palette.text.primary};
`

export default Help
