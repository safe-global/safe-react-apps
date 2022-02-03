import { Text, Title, GenericModal, ModalFooterConfirmation, Button } from '@gnosis.pm/safe-react-components';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toChecksumAddress, toWei, fromWei } from 'web3-utils';

import { ContractInterface } from '../../hooks/useServices/interfaceRepository';
import { ProposedTransaction } from '../../typings/models';
import { encodeToHexData, getTxDescription, isValidAddress } from '../../utils';
import { ModalBody } from '../ModalBody';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  CONTRACT_VALUES_FIELD_NAME,
  HEX_ENCODED_DATA_FIELD_NAME,
  SolodityFormValues,
  TOKEN_INPUT_NAME,
  TO_ADDRESS_FIELD_NAME,
} from './SolidityForm';

type AddNewTransactionFormProps = {
  contract: ContractInterface | null;
  to: string;
  transactions: ProposedTransaction[];
  onAddTransaction: (transaction: ProposedTransaction) => void;
  onRemoveTransaction: (index: number) => void;
  onSubmitTransactions: () => void;
  networkPrefix: undefined | string;
  getAddressFromDomain: (name: string) => Promise<string>;
  nativeCurrencySymbol: undefined | string;
};

const AddNewTransactionForm = ({
  transactions,
  onAddTransaction,
  onSubmitTransactions,
  onRemoveTransaction,
  contract,
  to,
  networkPrefix,
  getAddressFromDomain,
  nativeCurrencySymbol,
}: AddNewTransactionFormProps) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const showABIWarning = contract && !contract?.methods.length;

  const initialFormValues = {
    [TO_ADDRESS_FIELD_NAME]: isValidAddress(to) ? to : '',
    [CONTRACT_METHOD_INDEX_FIELD_NAME]: '0',
  };

  function onSubmit(values: SolodityFormValues) {
    const contractMethodIndex = values[CONTRACT_METHOD_INDEX_FIELD_NAME];
    const toAddress = values[TO_ADDRESS_FIELD_NAME];
    const tokenValue = values[TOKEN_INPUT_NAME];
    const contractFieldsValues = values[CONTRACT_VALUES_FIELD_NAME];
    const hexEncodedData = values[HEX_ENCODED_DATA_FIELD_NAME];

    const contractMethod = contract?.methods[Number(contractMethodIndex)];

    const data = hexEncodedData || encodeToHexData(contractMethod, contractFieldsValues) || '0x';
    const to = toChecksumAddress(toAddress);
    const value = toWei(tokenValue || '0');

    const contractInteractionDescription = hexEncodedData || getTxDescription(contractMethod, contractFieldsValues);
    const transferDescription = `Transfer ${fromWei(value)} ${nativeCurrencySymbol} to ${to}`;
    const description = contractInteractionDescription || transferDescription;

    onAddTransaction({
      description,
      raw: { to, value, data },
    });
  }

  useEffect(() => {
    const hasTransactions = transactions.length !== 0;

    if (!hasTransactions) {
      setShowReviewModal(false);
    }
  }, [transactions]);

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

          {/* Send Transactions btn */}
          <Button
            size="md"
            type="button"
            disabled={!transactions.length}
            variant="contained"
            color="primary"
            onClick={() => setShowReviewModal(true)}
          >
            {`Send Transactions ${transactions.length ? `(${transactions.length})` : ''}`}
          </Button>
        </ButtonContainer>
      </SolidityForm>

      {/* Transactions Modal */}
      {showReviewModal && (
        <GenericModal
          body={<ModalBody txs={transactions} deleteTx={onRemoveTransaction} />}
          onClose={() => setShowReviewModal(false)}
          title="Send Transactions"
          footer={
            <ModalFooterConfirmation handleOk={onSubmitTransactions} handleCancel={() => setShowReviewModal(false)} />
          }
        />
      )}
    </>
  );
};

export default AddNewTransactionForm;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;
