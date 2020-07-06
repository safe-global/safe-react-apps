import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";

import {
  Text,
  Title,
  Loader,
  theme,
  TextField,
  ButtonLink,
} from "@gnosis.pm/safe-react-components";
import initSdk, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

import { BalanceInfo, getSafes, getBalances } from "./api";
import findMySafeImg from "./find-my-safe.png";
import Balances from "./components/Balances";

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledImage = styled.img`
  max-height: 60px;
  max-width: 60px;
  margin-right: 5px;
`;

const StyledTitle = styled(Title)`
  margin: 0px;
`;

const StyledTextField = styled(TextField)`
  width: 520px;
`;

const SearchContent = styled.div`
  display: flex;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const SafesList = styled.div`
  margin-top: 10px;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SafeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  :hover {
    background-color: ${theme.colors.primaryLight};
  }
`;

const SafeBalances = styled.div`
  margin-top: 55px;
  width: 100%;
`;

const FindMySafe = () => {
  const [appsSdk] = useState(initSdk());
  const [safeInfo, setSafeInfo] = useState<SafeInfo>();

  const [address, setAddress] = useState("");
  const [safes, setSafes] = useState<string[]>([]);
  const [loadingSafes, setLoadingSafes] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [selectedSafe, setSelectedSafe] = useState<string | undefined>();
  const [balances, setBalances] = useState<BalanceInfo[] | undefined>([]);

  // config safe connector
  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
    });

    return () => appsSdk.removeListeners();
  }, [appsSdk]);

  const handleSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const address = event.target.value;
    setAddress(address);
    setSelectedSafe(undefined);
    setBalances(undefined);

    if (!address.length) {
      setSafes([]);
      setSelectedSafe(undefined);
      return;
    }

    setLoadingSafes(true);
    try {
      const res = await getSafes(address, safeInfo!.network);
      setSafes(res);
      setLoadingSafes(false);
    } catch (error) {
      setLoadingSafes(false);
    }
  };

  const handleSafeClick = async (safe: string): Promise<void> => {
    setSelectedSafe(safe);
    setLoadingBalances(true);

    try {
      const res = await getBalances(safe, safeInfo!.network);
      setBalances(res);
      setLoadingBalances(false);
    } catch (error) {
      setLoadingBalances(false);
    }
  };

  if (!safeInfo) {
    return <Loader size="lg" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <TitleContainer>
        <StyledImage src={findMySafeImg} alt="findMySafeLogo" />
        <StyledTitle size="md"> Find my safe</StyledTitle>
      </TitleContainer>
      <Text size="lg">
        This app allows you to search for Safes that have a specific owner. <br />
        Enter an Ethereum address to see if there are any Safes controlled by
        it.
      </Text>

      <SearchContent>
        <LeftContent>
          <StyledTextField
            value={address}
            label="Enter Address"
            onChange={handleSearch}
          />

          <SafesList>
            {loadingSafes ? (
              <Loader size="md" />
            ) : (
              safes.map((s) => (
                <SafeItem key={s}>
                  <Text
                    size="md"
                    color={selectedSafe === s ? "primary" : "text"}
                    strong={selectedSafe === s}
                  >
                    {s}
                  </Text>
                  <ButtonLink
                    color="primary"
                    onClick={() => handleSafeClick(s)}
                  >
                    balances
                  </ButtonLink>
                </SafeItem>
              ))
            )}
          </SafesList>
        </LeftContent>
        <SafeBalances>
          <Balances
            selectedSafe={selectedSafe}
            loadingBalances={loadingBalances}
            balances={balances}
          />
        </SafeBalances>
      </SearchContent>
    </ThemeProvider>
  );
};

export default FindMySafe;
