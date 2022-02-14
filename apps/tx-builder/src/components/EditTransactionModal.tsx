import { GenericModal, Button } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { ProposedTransaction } from '../typings/models';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  CONTRACT_VALUES_FIELD_NAME,
  HEX_ENCODED_DATA_FIELD_NAME,
  NATIVE_VALUE_FIELD_NAME,
  SolidityFormValuesTypes,
  TO_ADDRESS_FIELD_NAME,
} from './forms/SolidityForm';

type EditTransactionModalProps = {
  editingTransactionIndex: number | null;
  transaction: ProposedTransaction;
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
}: EditTransactionModalProps) => {
  const initialFormValues: Partial<SolidityFormValuesTypes> = {
    [TO_ADDRESS_FIELD_NAME]: transaction.raw.to,
    [NATIVE_VALUE_FIELD_NAME]: transaction.raw.value,
    [HEX_ENCODED_DATA_FIELD_NAME]: transaction.raw.data,
  };

  // If the transaction is not a custom hex encoded data, we need to set the contract method index
  if (transaction.description.contractMethod && transaction.contractInterface) {
    initialFormValues[CONTRACT_METHOD_INDEX_FIELD_NAME] = transaction.description.contractMethodIndex;
  }

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
            onSubmit={() => {}}
          >
            <ButtonContainer>
              {/* Add transaction btn */}
              <Button size="md" color="primary" type="submit">
                Add transaction
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
