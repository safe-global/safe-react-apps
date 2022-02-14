import React, { ReactElement, useState, useEffect } from 'react';
import { Text, Title, Link, AddressInput } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import InputAdornment from '@material-ui/core/InputAdornment';
import CheckCircle from '@material-ui/icons/CheckCircle';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import useTransactions from '../hooks/useTransactions';
import { isValidAddress } from '../utils';
import AddNewTransactionForm from './forms/AddNewTransactionForm';
import TransactionsBatchList from './TransactionsBatchList';
import CreateNewBatchCard from './CreateNewBatchCard';

const Dashboard = (): ReactElement => {
  const { web3, interfaceRepo, chainInfo } = useServices();
  const { transactions, handleAddTransaction, handleRemoveTransaction, handleSubmitTransactions } = useTransactions();
  const [addressOrAbi, setAddressOrAbi] = useState('');
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
        const contract = await interfaceRepo.loadAbi(addressOrAbi);
        setContract(contract);
      } catch (e) {
        setContract(null);
        setLoadContractError('No ABI found for this address');
        console.error(e);
      }
      setIsABILoading(false);
    };

    loadContract(addressOrAbi);
  }, [addressOrAbi, interfaceRepo]);

  const getAddressFromDomain = (name: string): Promise<string> => {
    return web3?.eth.ens.getAddress(name) || new Promise((resolve) => resolve(name));
  };

  const isValidAddressOrContract = (isValidAddress(addressOrAbi) || contract) && !isABILoading;

  return (
    <Wrapper>
      <AddNewTransactionFormWrapper>
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

        {/* ABI or Address Input */}
        <StyledAddressInput
          id={'address-or-ABI-input'}
          name="addressOrAbi"
          label="Enter Address, ENS Name or ABI"
          hiddenLabel={false}
          address={addressOrAbi}
          showNetworkPrefix={!!chainInfo?.shortName}
          networkPrefix={chainInfo?.shortName}
          error={!isValidAddressOrContract ? loadContractError : ''}
          showLoadingSpinner={isABILoading}
          getAddressFromDomain={getAddressFromDomain}
          onChangeAddress={(addressOrAbi: string) => setAddressOrAbi(addressOrAbi)}
          InputProps={{
            endAdornment: isValidAddressOrContract && (
              <InputAdornment position="end">
                <CheckIconAddressAdornment />
              </InputAdornment>
            ),
          }}
        />

        {/* ABI Warning */}
        {isValidAddressOrContract && !contract && (
          <StyledWarningText color="warning" size="lg">
            No ABI found for this address
          </StyledWarningText>
        )}

        {isValidAddressOrContract && (
          <AddNewTransactionForm
            onAddTransaction={handleAddTransaction}
            contract={contract}
            to={addressOrAbi}
            networkPrefix={chainInfo?.shortName}
            getAddressFromDomain={getAddressFromDomain}
            nativeCurrencySymbol={chainInfo?.nativeCurrency.symbol}
          />
        )}
      </AddNewTransactionFormWrapper>

      <TransactionsSectionWrapper>
        {transactions.length > 0 ? (
          <TransactionsBatchList
            transactions={transactions}
            // For add batch
            showTransactionDetails={false}
            allowTransactionReordering
            // // For review batch
            // showTransactionDetails
            // allowTransactionReordering={false}
            onRemoveTransaction={handleRemoveTransaction}
            onSubmitTransactions={handleSubmitTransactions}
          />
        ) : (
          <CreateNewBatchCard />
        )}
      </TransactionsSectionWrapper>
    </Wrapper>
  );
};

export default Dashboard;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
`;

const AddNewTransactionFormWrapper = styled.div`
  width: 400px;
  margin-right: 48px;
  padding: 24px;
  border-radius: 8px;

  background-color: white;
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
    width: 400px;

    .MuiFormLabel-root {
      color: #0000008a;
    }

    .MuiFormLabel-root.Mui-focused {
      color: #008c73;
    }
  }
`;

const TransactionsSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
