import { Text, Title, Button } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';

import { ContractInterface } from '../../hooks/useServices/interfaceRepository';
import { ProposedTransaction } from '../../typings/models';
import { isValidAddress } from '../../utils';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  SolidityFormValuesTypes,
  TO_ADDRESS_FIELD_NAME,
  parseFormToProposedTransaction,
} from './SolidityForm';

type AddNewTransactionFormProps = {
  contract: ContractInterface | null;
  to: string;
  onAddTransaction: (transaction: ProposedTransaction) => void;
  networkPrefix: string;
  nativeCurrencySymbol: string;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const AddNewTransactionForm = ({
  onAddTransaction,
  contract,
  to,
  networkPrefix,
  getAddressFromDomain,
  nativeCurrencySymbol,
}: AddNewTransactionFormProps) => {
  const showABIWarning = contract && !contract?.methods.length;

  const initialFormValues = {
    [TO_ADDRESS_FIELD_NAME]: isValidAddress(to) ? to : '',
    [CONTRACT_METHOD_INDEX_FIELD_NAME]: '0',
  };

  const onSubmit = (values: SolidityFormValuesTypes) => {
    const proposedTransaction = parseFormToProposedTransaction(values, contract);

    onAddTransaction(proposedTransaction);
  };

  return (
    <>
      <Title size="xs">Transaction information</Title>

      {showABIWarning && <Text size="lg">Contract ABI doesn't have any public methods.</Text>}

      <SolidityForm
        id="solidity-contract-form"
        initialValues={initialFormValues}
        contract={contract}
        getAddressFromDomain={getAddressFromDomain}
        nativeCurrencySymbol={nativeCurrencySymbol}
        networkPrefix={networkPrefix}
        onSubmit={onSubmit}
      >
        <ButtonContainer>
          {/* Add transaction btn */}
          <Button size="md" color="primary" type="submit">
            Add transaction
          </Button>
        </ButtonContainer>
      </SolidityForm>
    </>
  );
};

export default AddNewTransactionForm;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;
