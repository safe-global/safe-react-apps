import React, { SyntheticEvent } from 'react';
import { Button, Text, Link } from '@gnosis.pm/safe-react-components';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { ProposedTransaction } from '../typings/models';

type Props = { txs: Array<ProposedTransaction>; deleteTx: (index: number) => void };

const WrappedText = styled(Text)`
  word-break: break-all;
  margin: 5px 0;
`;

const ShowMeMore = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleToggle = (e: SyntheticEvent) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <span>
      {expanded ? text : `${text.substr(0, 30)}...`}
      <Link onClick={handleToggle}>{expanded ? 'Show me less' : 'Show me more'}</Link>
    </span>
  );
};

export const ModalBody = ({ txs, deleteTx }: Props) => {
  return (
    <>
      {txs.map((tx, index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="row-reverse"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Button size="md" variant="outlined" iconType="delete" color="error" onClick={() => deleteTx(index)}>
            {''}
          </Button>
          <WrappedText size="lg">
            {tx.description.startsWith('0x') ? <ShowMeMore text={tx.description} /> : tx.description}
          </WrappedText>
        </Box>
      ))}
    </>
  );
};
