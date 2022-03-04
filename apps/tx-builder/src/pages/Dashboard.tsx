import { ReactElement, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Title, Link, AddressInput, Button } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import CheckCircle from '@material-ui/icons/CheckCircle';

import { isValidAddress } from '../utils';
import AddNewTransactionForm from '../components/forms/AddNewTransactionForm';
import TransactionsBatchList from '../components/TransactionsBatchList';
import CreateNewBatchCard from '../components/CreateNewBatchCard';
import JsonField from '../components/forms/fields/JsonField';
import { ContractInterface } from '../typings/models';
import { useTransactions, useTransactionLibrary } from '../store';
import { REVIEW_AND_CONFIRM_PATH } from '../routes/routes';
import InterfaceRepository from '../hooks/useServices/interfaceRepository';

type DashboardProps = {
  interfaceRepo: InterfaceRepository | undefined;
  networkPrefix: string | undefined;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const Dashboard = ({
  interfaceRepo,
  networkPrefix,
  nativeCurrencySymbol,
  getAddressFromDomain,
}: DashboardProps): ReactElement => {
  const { transactions, removeAllTransactions, reorderTransactions, removeTransaction } = useTransactions();
  const { importBatch, downloadBatch, saveBatch } = useTransactionLibrary();

  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [isABILoading, setIsABILoading] = useState(false);
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [loadContractError, setLoadContractError] = useState('');

  const navigate = useNavigate();

  // Load contract from address or ABI
  useEffect(() => {
    const loadContract = async (address: string) => {
      setLoadContractError('');

      if (!address || !interfaceRepo) {
        return;
      }

      try {
        if (isValidAddress(address)) {
          setIsABILoading(true);
          setAbi(JSON.stringify(await interfaceRepo.loadAbi(address)));
        }
      } catch (e) {
        setAbi('');
        setLoadContractError('No ABI found for this address');
        console.error(e);
      }
      setIsABILoading(false);
    };

    loadContract(address);
  }, [address, interfaceRepo]);

  useEffect(() => {
    if (!abi || !interfaceRepo) {
      setContract(null);
      return;
    }

    setContract(interfaceRepo.getMethods(abi));
  }, [abi, interfaceRepo]);

  const isAddressInputFieldValid = isValidAddress(address) || !address;

  const contractHasMethods = contract && contract.methods.length > 0 && !isABILoading;

  const isTransferTransaction = isValidAddress(address) && !abi && !isABILoading;
  const isContractInteractionTransaction = abi && contract && !isABILoading;

  const showNewTransactionForm = isTransferTransaction || isContractInteractionTransaction;

  return (
    <Wrapper>
      <Grid alignItems="flex-start" container justifyContent="center" spacing={6}>
        <AddNewTransactionFormWrapper item xs={12} md={6}>
          <StyledTitle size="lg">New Transaction</StyledTitle>

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

          {/* Address Input */}
          <AddressInput
            id="address"
            name="address"
            label="Enter Address or ENS Name"
            hiddenLabel={false}
            address={address}
            fullWidth
            showNetworkPrefix={!!networkPrefix}
            networkPrefix={networkPrefix}
            error={isAddressInputFieldValid ? '' : 'The address is not valid'}
            showLoadingSpinner={isABILoading}
            showErrorsInTheLabel={false}
            getAddressFromDomain={getAddressFromDomain}
            onChangeAddress={(address: string) => setAddress(address)}
            InputProps={{
              endAdornment: contractHasMethods && isValidAddress(address) && (
                <InputAdornment position="end">
                  <CheckIconAddressAdornment />
                </InputAdornment>
              ),
            }}
          />

          {/* ABI Warning */}
          {loadContractError && (
            <StyledWarningText color="warning" size="lg">
              No ABI found for this address
            </StyledWarningText>
          )}

          <JsonField id={'abi'} name="abi" label="Enter ABI" value={abi} onChange={setAbi} />

          {showNewTransactionForm && (
            <AddNewTransactionForm
              contract={contract}
              to={address}
              networkPrefix={networkPrefix}
              getAddressFromDomain={getAddressFromDomain}
              nativeCurrencySymbol={nativeCurrencySymbol}
            />
          )}
        </AddNewTransactionFormWrapper>

        {/* Transactions Batch section */}
        <TransactionsSectionWrapper item xs={12} md={6}>
          {transactions.length > 0 ? (
            <>
              <TransactionsBatchList
                transactions={transactions}
                removeTransaction={removeTransaction}
                saveBatch={saveBatch}
                downloadBatch={downloadBatch}
                removeAllTransactions={removeAllTransactions}
                reorderTransactions={reorderTransactions}
                showTransactionDetails={false}
                showBatchHeader
              />
              {/* Go to Review Screen button */}
              <Button
                size="md"
                type="button"
                disabled={!transactions.length}
                style={{ marginLeft: 35 }}
                variant="contained"
                color="primary"
                onClick={() => navigate(REVIEW_AND_CONFIRM_PATH)}
              >
                Create Batch
              </Button>
            </>
          ) : (
            <CreateNewBatchCard onFileSelected={importBatch} />
          )}
        </TransactionsSectionWrapper>
      </Grid>
    </Wrapper>
  );
};

export default Dashboard;

const Wrapper = styled.main`
  && {
    padding: 48px;
    padding-top: 120px;
    max-width: 1024px;
    margin: 0 auto;
  }
`;

const AddNewTransactionFormWrapper = styled(Grid)`
  border-radius: 8px;
  background-color: white;
`;

const TransactionsSectionWrapper = styled(Grid)`
  position: sticky;
  top: 40px;
  align-self: flex-start;
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
  line-height: 22px;
  font-size: 16px;
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