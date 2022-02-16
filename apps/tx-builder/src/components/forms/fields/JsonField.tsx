import { useState, useCallback, ClipboardEvent } from 'react';
import styled from 'styled-components';
import { Icon, TextFieldInput, Tooltip, GenericModal, Text, Button, IconTypes } from '@gnosis.pm/safe-react-components';
import IconButton from '@material-ui/core/IconButton';
import { Box } from '@material-ui/core';
import { errorBaseStyles } from '../styles';

const DEFAULT_ROWS = 4;

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const JsonField = ({ id, name, label, value, onChange }: Props) => {
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [tempAbi, setTempAbi] = useState(value);
  const [isPrettified, setIsPrettified] = useState(false);

  const toggleFormatJSON = useCallback(() => {
    if (!value) {
      return;
    }

    try {
      onChange(JSON.stringify(JSON.parse(value), null, isPrettified ? 0 : 2));
      setIsPrettified(!isPrettified);
    } catch (e) {
      console.error(e);
      onChange(value);
    }
  }, [onChange, value, isPrettified]);

  const toggleModal = useCallback(() => setShowReplaceModal(!showReplaceModal), [showReplaceModal]);

  const changeAbi = useCallback(() => {
    onChange(tempAbi);
    setIsPrettified(false);
    toggleModal();
  }, [tempAbi, onChange, toggleModal]);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const clipboardData = event.clipboardData;
      const pastedData = clipboardData?.getData('Text') || '';

      if (value && pastedData) {
        setTempAbi(pastedData);
        toggleModal();
      } else {
        onChange(pastedData);
      }
    },
    [onChange, toggleModal, value],
  );

  return (
    <>
      <JSONFieldContainer>
        <StyledTextField
          id={id}
          name={name}
          label={label}
          multiline
          value={value}
          minRows={DEFAULT_ROWS}
          maxRows={DEFAULT_ROWS * 4}
          fullWidth
          hiddenLabel={false}
          onPaste={handlePaste}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          spellCheck={false}
          showErrorsInTheLabel={false}
          error={isValidJSON(value) ? undefined : 'Invalid JSON value'}
        />

        <IconContainer>
          {!isPrettified && (
            <IconContainerButton tooltipLabel="Prettify JSON" iconType="code" onClick={toggleFormatJSON} />
          )}
          {isPrettified && (
            <IconContainerButton tooltipLabel="Stringify JSON" iconType="cross" onClick={toggleFormatJSON} />
          )}
        </IconContainer>
      </JSONFieldContainer>

      {showReplaceModal && (
        <GenericModal
          body={
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Text size="lg">Do you want to replace the current ABI?</Text>
            </Box>
          }
          onClose={() => toggleModal}
          title="Replace ABI"
          footer={
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Button size="md" color="primary" onClick={changeAbi}>
                Accept
              </Button>
              <Button size="md" color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </Box>
          }
        />
      )}
    </>
  );
};

const isValidJSON = (value: string | undefined) => {
  if (value) {
    try {
      JSON.parse(value);
    } catch {
      return false;
    }
  }

  return true;
};

const IconContainerButton = ({
  tooltipLabel,
  iconType,
  onClick,
}: {
  tooltipLabel: string;
  iconType: IconTypes;
  onClick: () => void;
}) => (
  <Tooltip title={tooltipLabel}>
    <StyledButton size="small" color="primary" onClick={onClick}>
      <Icon size="sm" type={iconType} />
    </StyledButton>
  </Tooltip>
);

const JSONFieldContainer = styled.div`
  position: relative;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;
`;

const StyledTextField = styled(TextFieldInput)`
  && {
    width: 400px;
    margin-top: 10px;
    ${errorBaseStyles}

    textarea {
      font-family: monospace;
      font-size: 12px;
      &.MuiInputBase-input {
        padding: 0;
      }
    }
  }
`;

const StyledButton = styled(IconButton)`
  margin: 0 5px;
`;

export default JsonField;
