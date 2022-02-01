import { Text, Title, GenericModal, ModalFooterConfirmation, Button } from '@gnosis.pm/safe-react-components';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toChecksumAddress, toWei, fromWei } from 'web3-utils';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import { ProposedTransaction } from '../typings/models';
import { encodeToHexData, getTxDescription, isValidAddress } from '../utils';
import SolidityForm from './forms/SolidityForm';
import { ModalBody } from './ModalBody';

type Props = {
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

function AddNewTransactionForm({
  transactions,
  onAddTransaction,
  onSubmitTransactions,
  onRemoveTransaction,
  contract,
  to,
  networkPrefix,
  getAddressFromDomain,
  nativeCurrencySymbol,
}: Props) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const showABIWarning = contract && !contract?.methods.length;

  const initialFormValues = {
    toAddress: isValidAddress(to) ? to : '',
    contractMethodIndex: 0,
  };

  function onSubmit(values: Record<string, string | number | undefined>) {
    const { hexEncodedData, contractMethodIndex, contractFieldsValues, toAddress, tokenValue } = values;

    const contractMethod = contract?.methods[contractMethodIndex as number];

    const data = hexEncodedData || encodeToHexData(contractMethod, contractFieldsValues) || '0x';
    const to = toChecksumAddress(toAddress as string);
    const value = toWei((tokenValue as string) || '0');
    const transferDescription = `Transfer ${fromWei(value)} ${nativeCurrencySymbol} to ${to}`;
    const description =
      (hexEncodedData as string) || getTxDescription(contractMethod, contractFieldsValues) || transferDescription;

    onAddTransaction({
      description,
      raw: { to, value, data },
    });
  }

  useEffect(() => {
    if (transactions.length === 0) {
      setShowReviewModal(false);
    }
  }, [transactions]);

  return (
    <>
      <Title size="xs">NEW: Transaction information</Title>

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
          {/* Add transaction Btn */}
          <Button size="md" color="primary" type="submit">
            Add transaction
          </Button>

          {/* Send Transactions Btn */}
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

      {/* TXs MODAL */}
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
}

export default AddNewTransactionForm;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;
