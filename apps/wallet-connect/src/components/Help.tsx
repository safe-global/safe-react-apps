import { Accordion, AccordionSummary, IconText, AccordionDetails, Text } from '@gnosis.pm/safe-react-components';
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
          <Box display="flex" alignItems="center">
            <Dot>
              <DotText size="sm">{index + 1}</DotText>
            </Dot>
            <Text size="sm">{step}</Text>
          </Box>
        ))}
      </StyledAccordionDetails>
    </Accordion>
  );
};

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

const Dot = styled.div`
  position: relative;
  background: #f0efee;
  color: #566976;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  text-align: center;
  padding: 3px;
  font-size: 10px;
  margin-right: 16px;
`;

const DotText = styled(Text)`
  position: absolute;
`;
export default Help;
