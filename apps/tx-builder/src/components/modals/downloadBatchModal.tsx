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
const BATCH_FILE_NAME_FIELD = 'batchFileName';

type CreateBatchFormValuesTypes = {
  [BATCH_FILE_NAME_FIELD]: string;
};

const DownloadBatchModal = ({ onClick, onClose }: SaveBatchModalProps) => {
  const { handleSubmit, control } = useForm<CreateBatchFormValuesTypes>({
    mode: 'onTouched',
  });

  const onSubmit = (values: CreateBatchFormValuesTypes) => {
    const { [BATCH_FILE_NAME_FIELD]: fileName } = values;
    onClick(fileName);
  };

  return (
    <GenericModal
      title="Download Batch"
      withoutBodyPadding
      body={
        <StyledModalBodyWrapper>
          <form id={'download-batch-form'} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field
              id="batch-file-name-input"
              name={BATCH_FILE_NAME_FIELD}
              label={'File name'}
              fieldType={TEXT_FIELD_TYPE}
              fullWidth
              required
              control={control}
              showErrorsInTheLabel={false}
            />
            <Box display="flex" alignItems="center" justifyContent="center" maxWidth={'450px'}>
              <Button size="md" type="submit">
                Download
              </Button>
            </Box>
          </form>
        </StyledModalBodyWrapper>
      }
      onClose={onClose}
    />
  );
};

export default DownloadBatchModal;

const StyledModalBodyWrapper = styled.div`
  padding: 24px;
  max-width: 450px;
`;
