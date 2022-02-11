import { Accordion, AccordionSummary, IconText, AccordionDetails, Text, Dot } from '@gnosis.pm/safe-react-components';
import { Box } from '@material-ui/core';
import styled from 'styled-components';

type HelpProps = {
  title: string;
  steps: string[];
};

const Help = ({ title, steps }: HelpProps): React.ReactElement => {
  return (
    <Accordion compact>
      <AccordionSummary>
        <IconText iconSize="sm" textSize="xl" iconType="question" text={title} />
      </AccordionSummary>
      <StyledAccordionDetails>
        {steps.map((step, index) => (
          <StyledBox display="flex" marginBottom={2} alignItems="center">
            <StyledDot color="primary">
              <DotText size="sm">{index + 1}</DotText>
            </StyledDot>
            <Text size="sm">{step}</Text>
          </StyledBox>
        ))}
      </StyledAccordionDetails>
    </Accordion>
  );
};

const StyledBox = styled(Box)``;

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

const StyledDot = styled(Dot)`
  min-width: 16px;
  width: 16px;
  height: 16px;
  margin-right: 16px;
  background: #f0efee;
  color: #566976;
`;

const DotText = styled(Text)`
  position: absolute;
`;
export default Help;
