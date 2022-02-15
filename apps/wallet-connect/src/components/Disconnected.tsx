import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { TextFieldInput, Text, Icon, Loader, Tooltip } from '@gnosis.pm/safe-react-components';
import styled from 'styled-components';
import { ReactComponent as WalletConnectLogo } from '../assets/wallet-connect-logo.svg';

type DisconnectedProps = {
  isConnecting: boolean;
  url: string;
  onUrlChange: (url: string) => void;
  onPaste: (event: React.ClipboardEvent) => void;
  onCameraOpen: () => void;
  error: string;
};
const Disconnected = ({
  isConnecting,
  url,
  onUrlChange,
  onPaste,
  onCameraOpen,
  error,
}: DisconnectedProps): React.ReactElement => {
  return (
    <Box pt={6} pb={4}>
      <Grid container alignItems="center" justifyContent="center" spacing={3}>
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
              label="QR code or connection"
              hiddenLabel={false}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onPaste={onPaste}
              autoComplete="off"
              error={error}
              showErrorsInTheLabel={false}
              InputProps={{
                endAdornment: (
                  <StyledQRCodeAdorment position="end">
                    <Tooltip title="Start your camera and scan a QR" aria-label="Start your camera and scan a QR">
                      <IconButton onClick={onCameraOpen}>
                        <Icon size="md" type="qrCode" />
                      </IconButton>
                    </Tooltip>
                  </StyledQRCodeAdorment>
                ),
              }}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

const StyledQRCodeAdorment = styled(InputAdornment)`
  cursor: pointer;
`;

const StyledText = styled(Text)`
  margin-bottom: 8px;
  text-align: center;
`;

const StyledTextField = styled(TextFieldInput)`
  && {
    width: 430px;
    .MuiInputLabel-filled {
      color: #0000008a;
    }

    .MuiInputLabel-shrink {
      color: #008c73;
    }
  }
`;

export default Disconnected;
