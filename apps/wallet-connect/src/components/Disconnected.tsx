import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { TextFieldInput, Text, Loader, Tooltip } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { ReactComponent as WalletConnectLogo } from '../assets/wallet-connect-logo.svg';
import { ReactComponent as QRCode } from '../assets/qr-code.svg';

type DisconnectedProps = {
  isConnecting: boolean;
  url: string;
  onUrlChange: (url: string) => void;
  onPaste: (event: React.ClipboardEvent) => void;
  onCameraOpen: () => void;
  error: string;
};

const Disconnected = ({
  url,
  onUrlChange,
  onPaste,
  onCameraOpen,
  error,
  isConnecting,
}: DisconnectedProps): React.ReactElement => {
  return (
    <Container container alignItems="center" justifyContent="center" spacing={3}>
      <Grid item>
        <WalletConnectLogo />
      </Grid>
      <Grid item>
        <StyledText size="xl">Connect your Safe to a dApp via the WalletConnect and trigger transactions</StyledText>
      </Grid>
      <Grid item>
        {isConnecting ? (
          <Loader size="md" />
        ) : (
          <StyledTextField
            id="wc-uri"
            name="wc-uri"
            label="WalletConnect URI"
            placeholder="QR code or connection"
            hiddenLabel
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onPaste={onPaste}
            autoComplete="off"
            error={error}
            showErrorsInTheLabel={false}
            InputProps={{
              startAdornment: (
                <StyledQRCodeAdorment position="start">
                  <Tooltip title="Start your camera and scan a QR" aria-label="Start your camera and scan a QR">
                    <IconButton onClick={onCameraOpen}>
                      <QRCode />
                    </IconButton>
                  </Tooltip>
                </StyledQRCodeAdorment>
              ),
            }}
          />
        )}
      </Grid>
    </Container>
  );
};

const Container = styled(Grid)`
  padding: 38px 30px 45px 30px;
`;

const StyledQRCodeAdorment = styled(InputAdornment)`
  cursor: pointer;
`;

const StyledText = styled(Text)`
  margin-bottom: 8px;
  text-align: center;
`;

const StyledTextField = styled(TextFieldInput)`
  && {
    background-color: #fff;
    border-radius: 6px;
    border: 0;
    .MuiInputBase-root {
      border: 2px solid #e2e3e3;
      border-radius: 6px;
      &:hover {
        background-color: #fff;
      }
    }
    .MuiInputBase-input {
      border-left: 2px solid #e2e3e3;
      padding-left: 16px;
    }
    .MuiInputAdornment-root {
      margin-left: 4px;
      margin-right: 4px;
    }
    .MuiFilledInput-root {
      background-color: #fff;
      .MuiFilledInput-inputHiddenLabel {
        padding-top: 14px;
        padding-bottom: 14px;
      }
    }
    .MuiFilledInput-adornedStart {
      padding-left: 0;
    }
    .Mui-focused {
      background-color: #fff;
    }
    .MuiInputLabel-filled {
      color: #0000008a;
    }
    .MuiFilledInput-underline:after {
      border-bottom: 0;
    }
  }
`;

export default Disconnected;
