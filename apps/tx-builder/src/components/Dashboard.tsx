import { Text, Title, Link, TextField } from '@gnosis.pm/safe-react-components';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import { Builder } from './Builder';
import { ProposedTransaction } from '../typings/models';

const Wrapper = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column;
  padding: 24px;
  width: 520px;
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`;

const StyledText = styled(Text)`
  margin-bottom: 15px;
`;

const StyledTextFiled = styled(TextField)`
  && {
    width: 520px;
  }
`;

const Dashboard = () => {
  const { sdk, web3, interfaceRepo, chainInfo } = useServices();
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const [addressOrAbiInput, setAddressOrAbiInput] = useState('');
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [loadAbiError, setLoadAbiError] = useState(false);

  const handleAddressOrABIInput = async (e: React.ChangeEvent<HTMLInputElement>): Promise<ContractInterface | void> => {
    setContract(null);
    setLoadAbiError(false);

    const cleanInput = e.currentTarget?.value?.trim();
    setAddressOrAbiInput(cleanInput);

    if (!cleanInput.length || !web3 || !interfaceRepo) {
      return;
    }

    try {
      const contract = await interfaceRepo.loadAbi(cleanInput);
      setContract(contract);
    } catch (e) {
      setContract(null);
      setLoadAbiError(true);
      console.error(e);
    }
  };

  const isValidAddress = useCallback(
    (address: string | null) => {
      if (!address) {
        return false;
      }
      return web3?.utils.isAddress(address);
    },
    [web3],
  );

  const handleAddTransaction = useCallback(
    (tx: ProposedTransaction) => {
      setTransactions([...transactions, tx]);
    },
    [transactions],
  );

  const handleRemoveTransaction = useCallback(
    (index: number) => {
      const newTxs = transactions.slice();
      newTxs.splice(index, 1);
      setTransactions(newTxs);
    },
    [transactions],
  );

  const handleSubmitTransactions = useCallback(async () => {
    if (!transactions.length) {
      return;
    }

    try {
      await sdk.txs.send({ txs: transactions.map((transaction) => transaction.raw) }).catch(console.error);
      setTransactions([]);
    } catch (e) {
      console.error('Error sending transactions:', e);
    }
  }, [sdk.txs, transactions]);

  return (
    <Wrapper>
      <StyledTitle size="sm">Multisend transaction builder</StyledTitle>
      <StyledText size="sm">
        This app allows you to build a custom multisend transaction. Enter a Ethereum contract address or ABI to get
        started.{' '}
        <Link
          href="https://help.gnosis-safe.io/en/articles/4680071-create-a-batched-transaction-with-the-transaction-builder-safe-app"
          size="lg"
          target="_blank"
          rel="noreferrer"
        >
          Learn how to use the transaction builder.
        </Link>
      </StyledText>

      {/* ABI Input */}
      <StyledTextFiled value={addressOrAbiInput} label="Enter Address or ABI" onChange={handleAddressOrABIInput} />
      {loadAbiError && (
        <Text color="warning" size="lg">
          No ABI found for this address
        </Text>
      )}

      {/* Builder */}
      {(isValidAddress(addressOrAbiInput) || contract) && (
        <Builder
          contract={contract}
          to={addressOrAbiInput}
          chainId={chainInfo?.chainId}
          nativeCurrencySymbol={chainInfo?.nativeCurrency.symbol}
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onRemoveTransaction={handleRemoveTransaction}
          onSubmitTransactions={handleSubmitTransactions}
        />
      )}
    </Wrapper>
  );
};

export default Dashboard;
