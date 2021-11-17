import React from 'react';
import { Button, Text } from '@gnosis.pm/safe-react-components';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { ProposedTransaction } from '../typings/models';

type Props = { txs: Array<ProposedTransaction>; deleteTx: (index: number) => void };

const WrappedText = styled(Text)`
  word-break: break-all;
  margin: 5px 0;
`;

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
          <WrappedText size="lg">{tx.description}</WrappedText>
        </Box>
      ))}
    </>
  );
};
