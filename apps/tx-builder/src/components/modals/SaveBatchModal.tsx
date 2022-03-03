import { Button, GenericModal } from '@gnosis.pm/safe-react-components';
import Box from '@material-ui/core/Box';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Field from '../forms/fields/Field';
import { TEXT_FIELD_TYPE } from '../forms/fields/fields';

type SaveBatchModalProps = {
  onClick: (name: string) => void;
  onClose: () => void;
};
const BATCH_NAME_FIELD = 'batchName';

type CreateBatchFormValuesTypes = {
  [BATCH_NAME_FIELD]: string;
};

const SaveBatchModal = ({ onClick, onClose }: SaveBatchModalProps) => {
  const { handleSubmit, control } = useForm<CreateBatchFormValuesTypes>({
    mode: 'onTouched',
  });

  function onSubmit({ batchName }: CreateBatchFormValuesTypes) {
    onClick(batchName);
  }

  return (
    <GenericModal
      title="Save transaction Batch"
      withoutBodyPadding
      body={
        <StyledModalBodyWrapper>
          <form id={'create-batch-form'} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field
              id="token-value-input"
              name={BATCH_NAME_FIELD}
              label={'Batch name'}
              fieldType={TEXT_FIELD_TYPE}
              fullWidth
              required
              control={control}
              showErrorsInTheLabel={false}
            />
            <Box display="flex" alignItems="center" justifyContent="center" maxWidth={'450px'}>
              <Button size="md" type="submit">
                Create
              </Button>
            </Box>
          </form>
        </StyledModalBodyWrapper>
      }
      onClose={onClose}
    />
  );
};

export default SaveBatchModal;

const StyledModalBodyWrapper = styled.div`
  padding: 24px;
  max-width: 450px;
`;
