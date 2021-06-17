import { Button, Text } from '@gnosis.pm/safe-react-components';
import React from 'react';
import Box from '@material-ui/core/Box';
import { ProposedTransaction } from '../typings/models';

type Props = { txs: Array<ProposedTransaction>; deleteTx: (index: number) => void };

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
          <Text size="lg">{tx.description}</Text>
        </Box>
      ))}
    </>
  );
};
