import { GenericModal, Button } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import useServices from '../hooks/useServices';
import { ProposedTransaction } from '../typings/models';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  CONTRACT_VALUES_FIELD_NAME,
  HEX_ENCODED_DATA_FIELD_NAME,
  NATIVE_VALUE_FIELD_NAME,
  parseFormToProposedTransaction,
  SolidityFormValuesTypes,
  TO_ADDRESS_FIELD_NAME,
} from './forms/SolidityForm';

type EditTransactionModalProps = {
  editingTransactionIndex: number;
  transaction: ProposedTransaction;
  onSubmit: (transaction: ProposedTransaction) => void;
  onDelete: (transactionIndex: number) => void;
  onClose: () => void;
  nativeCurrencySymbol: string;
  networkPrefix: string;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const EditTransactionModal = ({
  editingTransactionIndex,
  transaction,
  onClose,
  nativeCurrencySymbol,
  networkPrefix,
  getAddressFromDomain,
  onSubmit,
  onDelete,
}: EditTransactionModalProps) => {
  const { web3 } = useServices();

  const initialFormValues: Partial<SolidityFormValuesTypes> = {
    [TO_ADDRESS_FIELD_NAME]: transaction.raw.to,
    [NATIVE_VALUE_FIELD_NAME]: web3?.utils.fromWei(transaction.raw.value, 'ether'),
    [HEX_ENCODED_DATA_FIELD_NAME]: transaction.raw.data,
  };

  // If the transaction is not a custom hex encoded data, we need to set the contract method index,
  // we need to set the contract fields values
  const contractMethodEditable = transaction.description.contractMethod && transaction.contractInterface;
  if (contractMethodEditable) {
    initialFormValues[CONTRACT_METHOD_INDEX_FIELD_NAME] = transaction.description.contractMethodIndex;

    // if fallback method is used, there are no values, therefore we check if values are present before setting them
    if (transaction.description.contractFieldsValues) {
      for (const [paramName, argument] of Object.entries(transaction.description.contractFieldsValues)) {
        initialFormValues[CONTRACT_VALUES_FIELD_NAME] = {
          ...initialFormValues[CONTRACT_VALUES_FIELD_NAME],
          [paramName]: argument,
        };
      }
    }
  }

  const handleSubmit = (values: SolidityFormValuesTypes) => {
    onClose();

    const editedTransaction = parseFormToProposedTransaction(values, transaction.contractInterface);

    // keep the id of the transaction
    onSubmit({ ...editedTransaction, id: transaction.id });
  };

  return (
    <GenericModal
      title={`Transaction ${editingTransactionIndex}`}
      body={
        <FormContainer>
          <SolidityForm
            id="solidity-contract-form"
            initialValues={initialFormValues}
            contract={transaction.contractInterface}
            nativeCurrencySymbol={nativeCurrencySymbol}
            networkPrefix={networkPrefix}
            getAddressFromDomain={getAddressFromDomain}
            defaultHexDataView={!contractMethodEditable}
            onSubmit={handleSubmit}
            hideHexToggler
          >
            <ButtonContainer>
              {/* Remove transaction btn */}
              <Button
                type="button"
                size="md"
                color="error"
                onClick={() => {
                  onClose();
                  onDelete(editingTransactionIndex);
                }}
              >
                Delete
              </Button>

              {/* Add transaction btn */}
              <Button size="md" color="primary" type="submit">
                Save transaction
              </Button>
            </ButtonContainer>
          </SolidityForm>
        </FormContainer>
      }
      onClose={onClose}
    />
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const FormContainer = styled.div`
  width: 400px;
  margin-right: 48px;
  padding: 24px;
  border-radius: 8px;

  background-color: white;
`;

export default EditTransactionModal;
