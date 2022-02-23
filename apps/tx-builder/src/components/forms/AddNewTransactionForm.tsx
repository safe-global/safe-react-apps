import { Text, Title, Button } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { toChecksumAddress, toWei } from 'web3-utils';

import { ContractInterface } from '../../hooks/useServices/interfaceRepository';
import { ProposedTransaction } from '../../typings/models';
import { encodeToHexData, isValidAddress } from '../../utils';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  CONTRACT_VALUES_FIELD_NAME,
  HEX_ENCODED_DATA_FIELD_NAME,
  SolidityFormValuesTypes,
  TOKEN_INPUT_NAME,
  TO_ADDRESS_FIELD_NAME,
} from './SolidityForm';

type AddNewTransactionFormProps = {
  contract: ContractInterface | null;
  to: string;
  onAddTransaction: (transaction: ProposedTransaction) => void;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
  nativeCurrencySymbol: undefined | string;
};

const AddNewTransactionForm = ({
  onAddTransaction,
  contract,
  to,
  networkPrefix,
  getAddressFromDomain,
  nativeCurrencySymbol,
}: AddNewTransactionFormProps) => {
  const initialFormValues = {
    [TO_ADDRESS_FIELD_NAME]: isValidAddress(to) ? to : '',
    [CONTRACT_METHOD_INDEX_FIELD_NAME]: '0',
  };

  const showNoPublicMethodsWarning = contract && contract.methods.length === 0;

  const onSubmit = (values: SolidityFormValuesTypes) => {
    const contractMethodIndex = values[CONTRACT_METHOD_INDEX_FIELD_NAME];
    const toAddress = values[TO_ADDRESS_FIELD_NAME];
    const tokenValue = values[TOKEN_INPUT_NAME];
    const contractFieldsValues = values[CONTRACT_VALUES_FIELD_NAME];
    const hexEncodedData = values[HEX_ENCODED_DATA_FIELD_NAME];

    const contractMethod = contract?.methods[Number(contractMethodIndex)];

    const data = hexEncodedData || encodeToHexData(contractMethod, contractFieldsValues) || '0x';
    const to = toChecksumAddress(toAddress);
    const value = toWei(tokenValue || '0');

    onAddTransaction({
      id: new Date().getTime(),
      description: {
        to,
        value,
        hexEncodedData,
        contractMethod: !hexEncodedData ? contractMethod : undefined,
        contractFieldsValues: !hexEncodedData ? contractFieldsValues : undefined,
        nativeCurrencySymbol,
        networkPrefix,
      },
      raw: { to, value, data },
    });
  };

  return (
    <>
      {/* No public methods Warning */}
      {showNoPublicMethodsWarning && (
        <StyledMethodWarning color="warning" size="lg">
          Contract ABI doesn't have any public methods.
        </StyledMethodWarning>
      )}

      <Title size="xs">Transaction information</Title>

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

const StyledMethodWarning = styled(Text)`
  margin-top: 8px;
`;
