import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import memoize from "lodash/memoize";
import Big from "big.js";
import {
  Text,
  Title,
  Loader,
  theme,
  TextField,
  ButtonLink,
} from "@gnosis.pm/safe-react-components";
import initSdk, { SafeInfo, Networks } from "@gnosis.pm/safe-apps-sdk";

import findMySafeImg from "./find-my-safe.png";
import TokenPlaceholder from "./token-placeholder.svg";

const apiNetwork: { [key in Networks]: string } = {
  rinkeby: "https://safe-transaction.staging.gnosisdev.com/api/v1",
  mainnet: "https://safe-transaction.mainnet.gnosis.io/api/v1/",
};

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
`

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
  height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const BalanceItem = styled.div`
  padding: 15px;

  display: flex;
  justify-content: space-between;
  align-items: center;
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

const NoBalanceFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const IconImage = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-right: 5px;
  }
`;

type BalanceInfo = {
  tokenAddress: string;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
  };
  balance: string;
};

const getSafes = memoize(
  async (address: string, network: Networks): Promise<string[]> => {
    const res = await axios.get<{ safes: string[] }>(
      `${apiNetwork[network]}/owners/${address}/`
    );
    return res.data.safes;
  }
);

const getBalances = memoize(
  async (safe: string, network: Networks): Promise<BalanceInfo[]> => {
    const res = await axios.get<BalanceInfo[]>(
      `${apiNetwork[network]}/safes/${safe}/balances/usd/`
    );

    return res.data.filter((b) => b.token !== null);
  }
);

export const setImageToPlaceholder: React.ReactEventHandler<HTMLImageElement> = (
  e
) => {
  (e.target as HTMLImageElement).onerror = null;
  (e.target as HTMLImageElement).src = TokenPlaceholder;
};

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

  const getBalancesContent = () => {
    if (!selectedSafe) {
      return null;
    }

    if (loadingBalances) {
      return <Loader size="md" />;
    }

    if (!balances?.length) {
      return (
        <NoBalanceFound>
          <Text size="lg" strong>
            Not balances found
          </Text>
        </NoBalanceFound>
      );
    }

    return balances?.map((b) =>
      b.token ? (
        <BalanceItem key={b.token.name}>
          <IconImage>
            <img
              height={28}
              src={b.token.logoUri}
              onError={setImageToPlaceholder}
              alt="Token logo"
            />
            {b.token.symbol}
          </IconImage>
          <div>{new Big(b.balance).div(10 ** b.token.decimals).toFixed(4)}</div>
        </BalanceItem>
      ) : null
    );
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
        Enter an ethereum address to search for created safes
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
        <SafeBalances>{getBalancesContent()}</SafeBalances>
      </SearchContent>
    </ThemeProvider>
  );
};

export default FindMySafe;
