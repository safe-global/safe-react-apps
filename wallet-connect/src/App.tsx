import React, { useState, useEffect } from "react";
import jsQr from "jsqr";
import styled from "styled-components";
import format from "date-fns/format";

import {
  TextField,
  Button,
  Text,
  Title,
  Icon,
  Loader,
} from "@gnosis.pm/safe-react-components";

import { blobToImageData } from "./utils";
import { Wrapper } from "./components/layout";
import WCClientInfo from "./components/WCClientInfo";
import useWalletConnect from "./hooks/useWalletConnect";

const StyledTitle = styled(Title)`
  margin-top: 0;
`;

const StyledText = styled(Text)`
  margin-bottom: 8px;
`;

const StyledHelpLink = styled.div`
  display: flex;

  > :first-of-type {
    margin-right: 5px;
  }
`;

const WCContent = styled.div`
  min-width: 400px;
  margin-right: 20px;
`;

const HelpLink = () => (
  <StyledHelpLink>
    <a
      target="_blank"
      href="https://help.gnosis-safe.io/en/articles/4356253-how-to-use-walletconnect-with-the-gnosis-safe-multisig"
      rel="noopener noreferrer"
    >
      <Text color="primary" size="lg">
        How to use WalletConnect with the Gnosis Safe Multisig
      </Text>
    </a>
    <Icon type="externalLink" color="primary" size="sm" />
  </StyledHelpLink>
);

const ConnectedInstructions = () => (
  <>
    <StyledTitle size="sm">How to confirm transactions</StyledTitle>

    <StyledText size="lg">1) Trigger a transaction from the Dapp.</StyledText>

    <StyledText size="lg">
      2) Come back here to confirm the transaction. You will see a popup with
      transactions details. Review the details and submit the transaction.
    </StyledText>

    <StyledText size="lg">
      3) The transaction has to be confirmed be owners and executed just like
      any other Safe transaction.
    </StyledText>

    <HelpLink />
  </>
);

const DisconnectedInstructions = () => (
  <>
    <StyledTitle size="sm">How to connect to a Dapp</StyledTitle>

    <StyledText size="lg">
      1) Open a Dapp with WalletConnect support.
    </StyledText>

    <StyledText size="lg">
      2) Copy QR code image into clipboard (Shift+Command+4 on Mac, Windows
      key+PrtScn on Windows).
    </StyledText>

    <StyledText size="lg">
      3) Paste QR code image into the input field (Command+V on Mac, Ctrl+V on
      Windows)
    </StyledText>

    <StyledText size="lg">
      4) WalletConnect connection will be established automatically.
    </StyledText>

    <StyledText size="lg">
      5) Now you can trigger transactions via the Dapp to your Safe.
    </StyledText>

    <HelpLink />
  </>
);

const App = () => {
  const { wcClientData, wcConnect, wcDisconnect } = useWalletConnect();
  const [inputValue, setInputValue] = useState("");
  const [invalidQRCode, setInvalidQRCode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const onPaste = React.useCallback(
    (event: React.ClipboardEvent) => {
      setInvalidQRCode(false);
      setInputValue("");

      if (wcClientData) {
        return;
      }

      const items = event.clipboardData.items;
      for (const index in items) {
        const item = items[index];

        if (item.kind !== "file") {
          continue;
        }

        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = async (event: ProgressEvent<FileReader>) => {          
          const imageData = await blobToImageData(event.target?.result as string);
          const code = jsQr(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            setIsConnecting(true);
            wcConnect(code.data);
          } else {
            setInvalidQRCode(true);
            setInputValue(
              `Screen Shot ${format(new Date(), "yyyy-MM-dd")} at ${format(
                new Date(),
                "hh.mm.ss"
              )}`
            );
          }
        };
        reader.readAsDataURL(blob as Blob);
      }
    },
    [wcClientData, wcConnect]
  );

  const getDisconnectedContent = () => {
    if (isConnecting) {
      return <Loader size="md" />;
    }
    return (
      <TextField
        id="wc-uri"
        label="Paste WalletConnect QR code"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPaste={onPaste}
        meta={{
          error: invalidQRCode ? "Invalid QR code" : undefined,
        }}
      />
    );
  };

  const getConnectedContent = () => (
    <>
      <WCClientInfo
        name={wcClientData!.name}
        url={wcClientData!.url}
        iconSrc={wcClientData!.icons[0]}
      />

      <Button
        size="md"
        color="primary"
        variant="contained"
        onClick={() => wcDisconnect()}
      >
        Disconnect
      </Button>
    </>
  );

  // WalletConnect does not provide a loading/connecting status
  // This effects simulates a connecting status, and prevents
  // the user to initiate two connections in simultaneous.
  useEffect(() => {
    let interval: number;
    if (isConnecting) {
      interval = setTimeout(() => setIsConnecting(false), 2_000);
    }
    return () => clearTimeout(interval);
  }, [isConnecting]);

  return (
    <Wrapper>
      {/* WalletConnect */}
      <WCContent>
        <StyledTitle size="sm">Wallet Connect</StyledTitle>
        {wcClientData ? getConnectedContent() : getDisconnectedContent()}
      </WCContent>

      {/* Instructions */}
      <div>
        {wcClientData ? (
          <ConnectedInstructions />
        ) : (
          <DisconnectedInstructions />
        )}
      </div>
    </Wrapper>
  );
};

export default App;
