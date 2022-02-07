import React, { ReactElement, useState, useEffect } from 'react';
import { Text, Title, Link, AddressInput } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { InputAdornment } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import useTransactions from '../hooks/useTransactions';
import { isValidAddress } from '../utils';
import AddNewTransactionForm from './forms/AddNewTransactionForm';
import JsonField from './forms/fields/JsonField';

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

const StyledWarningText = styled(Text)`
  margin-top: 5px;
`;

const CheckIconAddressAdornment = styled(CheckCircle)`
  color: #03ae60;
  height: 20px;
`;

const StyledAddressInput = styled(AddressInput)`
  && {
    width: 520px;

    .MuiFormLabel-root {
      color: #0000008a;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #008c73;
    }
  }
`;

const Dashboard = (): ReactElement => {
  const { web3, interfaceRepo, chainInfo } = useServices();
  const { transactions, handleAddTransaction, handleRemoveTransaction, handleSubmitTransactions } = useTransactions();
  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [isABILoading, setIsABILoading] = useState(false);
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [loadContractError, setLoadContractError] = useState('');

  // Load contract from address or ABI
  useEffect(() => {
    const loadContract = async (addressOrAbi: string) => {
      setContract(null);
      setLoadContractError('');

      if (!addressOrAbi || !interfaceRepo) {
        return;
      }

      try {
        setIsABILoading(true);
        setAbi('');
        const contract = await interfaceRepo.loadAbi(addressOrAbi);
        setContract(contract);
      } catch (e) {
        setContract(null);
        setLoadContractError('No ABI found for this address');
        console.error(e);
      }
      setIsABILoading(false);
    };

    loadContract(address);
  }, [address, interfaceRepo]);

  useEffect(() => {
    (async () => {
      if (!abi || !interfaceRepo) {
        return;
      }

      setAddress('');
      setContract(await interfaceRepo.loadAbi(abi));
    })();
  }, [abi, interfaceRepo]);

  const getAddressFromDomain = (name: string): Promise<string> => {
    return web3?.eth.ens.getAddress(name) || new Promise((resolve) => resolve(name));
  };

  const isValidAddressOrContract = (isValidAddress(address) || contract) && !isABILoading;

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
      <p>{isValidAddressOrContract}</p>
      {/* ABI or Address Input */}
      <StyledAddressInput
        id={'address-or-ABI-input'}
        name="addressOrAbi"
        label="Enter Address, ENS Name or ABI"
        hiddenLabel={false}
        address={address}
        showNetworkPrefix={!!chainInfo?.shortName}
        networkPrefix={chainInfo?.shortName}
        error={!isValidAddressOrContract ? loadContractError : ''}
        showLoadingSpinner={isABILoading}
        getAddressFromDomain={getAddressFromDomain}
        onChangeAddress={(addressOrAbi: string) => setAddress(addressOrAbi)}
        InputProps={{
          endAdornment: isValidAddressOrContract && (
            <InputAdornment position="end">
              <CheckIconAddressAdornment />
            </InputAdornment>
          ),
        }}
      />

      <JsonField id={'abi'} name="abi" label="Enter JSON" value={abi} onChange={setAbi} />

      {/* ABI Warning */}
      {isValidAddressOrContract && !contract && (
        <StyledWarningText color="warning" size="lg">
          No ABI found for this address
        </StyledWarningText>
      )}

      {isValidAddressOrContract && (
        <AddNewTransactionForm
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          contract={contract}
          to={address || abi}
          networkPrefix={chainInfo?.shortName}
          getAddressFromDomain={getAddressFromDomain}
          nativeCurrencySymbol={chainInfo?.nativeCurrency.symbol}
          onRemoveTransaction={handleRemoveTransaction}
          onSubmitTransactions={handleSubmitTransactions}
        />
      )}
    </Wrapper>
  );
};

export default Dashboard;
