import { useState, useCallback, useEffect } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import { Icon, Loader, TextFieldInput, Tooltip } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import format from 'date-fns/format'
import jsQr from 'jsqr'

import { blobToImageData } from '../utils/images'
import ScanCode from './ScanCode'
import { useWalletConnectType, wcConnectType } from '../hooks/useWalletConnect'

type WalletConnectFieldProps = {
  wcClientData: useWalletConnectType['wcClientData']
  onConnect: wcConnectType
}

const WalletConnectField = ({
  wcClientData,
  onConnect,
}: WalletConnectFieldProps): React.ReactElement => {
  const [invalidQRCode, setInvalidQRCode] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const handleQRDialogClose = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    if (wcClientData) {
      setOpenDialog(false)
    }
  }, [wcClientData])

  // WalletConnect does not provide a loading/connecting status
  // This effects simulates a connecting status, and prevents
  // the user to initiate two connections in simultaneous.
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnecting) {
      interval = setTimeout(() => setIsConnecting(false), 2_000)
    }

    return () => clearTimeout(interval)
  }, [isConnecting])

  const onPaste = useCallback(
    (event: React.ClipboardEvent) => {
      const connectWithUri = (data: string) => {
        if (data.startsWith('wc')) {
          setIsConnecting(true)
          onConnect(data)
        }
      }

      const connectWithQR = (item: DataTransferItem) => {
        const blob = item.getAsFile()
        const reader = new FileReader()
        reader.onload = async (event: ProgressEvent<FileReader>) => {
          const imageData = await blobToImageData(event.target?.result as string)
          const code = jsQr(imageData.data, imageData.width, imageData.height)
          if (code?.data) {
            setIsConnecting(true)
            onConnect(code.data)
          } else {
            setInvalidQRCode(true)
            setInputValue(
              `Screen Shot ${format(new Date(), 'yyyy-MM-dd')} at ${format(
                new Date(),
                'hh.mm.ss',
              )}`,
            )
          }
        }
        reader.readAsDataURL(blob as Blob)
      }

      setInvalidQRCode(false)
      setInputValue('')

      if (wcClientData) {
        return
      }

      const items = event.clipboardData.items

      for (const index in items) {
        const item = items[index]

        if (item.kind === 'string' && item.type === 'text/plain') {
          connectWithUri(event.clipboardData.getData('Text'))
        }

        if (item.kind === 'file') {
          connectWithQR(item)
        }
      }
    },
    [wcClientData, onConnect],
  )

  // onConnect and close the dialog
  const wcConnect = useCallback(
    async (uri: string) => {
      onConnect(uri)
      setOpenDialog(false)
    },
    [onConnect],
  )

  if (isConnecting) {
    return <Loader size="md" />
  }

  return (
    <>
      <StyledTextField
        id="wc-uri"
        name="wc-uri"
        label="WalletConnect URI"
        placeholder="QR code or connection link"
        hiddenLabel
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onPaste={onPaste}
        autoComplete="off"
        error={invalidQRCode ? 'Invalid QR code' : ''}
        showErrorsInTheLabel={false}
        InputProps={{
          startAdornment: (
            <StyledQRCodeAdorment position="start">
              <Tooltip
                title="Start your camera and scan a QR"
                aria-label="Start your camera and scan a QR"
              >
                <IconButton onClick={() => setOpenDialog(open => !open)}>
                  <Icon type="qrCode" size="md" />
                </IconButton>
              </Tooltip>
            </StyledQRCodeAdorment>
          ),
        }}
      />
      <Dialog
        open={openDialog}
        onClose={handleQRDialogClose}
        aria-labelledby="Dialog to scan QR"
        aria-describedby="Dialog to load a QR code"
      >
        <StyledCloseDialogContainer>
          <Tooltip title="Close scan QR code dialog" aria-label="Close scan QR code dialog">
            <IconButton onClick={handleQRDialogClose}>
              <Icon size="md" type="cross" color="primary" />
            </IconButton>
          </Tooltip>
        </StyledCloseDialogContainer>
        <ScanCode wcConnect={wcConnect} wcClientData={wcClientData} />
      </Dialog>
    </>
  )
}

const StyledQRCodeAdorment = styled(InputAdornment)`
  cursor: pointer;
`

const StyledCloseDialogContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 4px;
  right: 4px;
`

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

      .MuiInputBase-input {
        border-left: 2px solid #e2e3e3;
        padding-left: 16px;
      }

      .MuiInputAdornment-root {
        margin-left: 4px;
        margin-right: 4px;
      }

      &.MuiFilledInput-root {
        background-color: #fff;
        .MuiFilledInput-inputHiddenLabel {
          padding-top: 14px;
          padding-bottom: 14px;
        }
        &.MuiFilledInput-underline:after {
          border-bottom: 0;
        }
      }

      &.MuiFilledInput-adornedStart {
        padding-left: 0;
      }

      .MuiInputLabel-filled {
        color: #0000008a;
      }
    }

    .Mui-focused {
      background-color: #fff;
    }
  }
`

export default WalletConnectField
