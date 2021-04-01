import { Text, Title, Link, TextField } from '@gnosis.pm/safe-react-components';
import React, { useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import styled from 'styled-components';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import { Builder } from './Builder';

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
  const { safe } = useSafeAppsSDK();
  const services = useServices(safe.network);

  const [addressOrAbiInput, setAddressOrAbiInput] = useState('');
  const [contract, setContract] = useState<ContractInterface | undefined>(undefined);
  const [loadAbiError, setLoadAbiError] = useState(false);

  const isValidAddress = (address: string) => services?.web3?.utils.isAddress(address);

  const handleAddressOrABIInput = async (e: React.ChangeEvent<HTMLInputElement>): Promise<ContractInterface | void> => {
    setContract(undefined);
    setLoadAbiError(false);

    const cleanInput = e.currentTarget?.value?.trim();
    setAddressOrAbiInput(cleanInput);

    if (!cleanInput.length || !services.web3 || !services.interfaceRepo) {
      return;
    }

    try {
      const contract = await services.interfaceRepo.loadAbi(cleanInput);
      setContract(contract);
    } catch (e) {
      setContract(undefined);
      setLoadAbiError(true);
      console.error(e);
    }
  };

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
      <Builder contract={contract} to={isValidAddress(addressOrAbiInput) ? addressOrAbiInput : null} />
    </Wrapper>
  );
};

export default Dashboard;
