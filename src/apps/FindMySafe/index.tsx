import React, { useState } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import debounce from "lodash/debounce";
import Big from "big.js";

import findMySafeImg from "./find-my-safe.png";
import { textShortener } from "../../utils/string";
import {
  Text,
  Title,
  Loader,
  theme,
  TextField,
  FixedIcon,
} from "@gnosis.pm/safe-react-components";

const apiNetwork = {
  rinkeby: "https://safe-transaction.staging.gnosisdev.com/api/v1",
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
  height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SafeItem = styled.div`
  padding: 15px;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
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

const FindMySafe = () => {
  const [address, setAddress] = useState("");
  const [safes, setSafes] = useState<string[]>([]);
  const [loadingSafes, setLoadingSafes] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [selectedSafe, setSelectedSafe] = useState<string | undefined>();
  const [balances, setBalances] = useState<BalanceInfo[] | undefined>([]);

  const toShortAddress = textShortener({
    charsEnd: 15,
    charsStart: 15,
    ellipsis: "...",
  });

  const getSafes = debounce(async (address: string): Promise<void> => {
    setLoadingSafes(true);
    try {
      const res = await axios.get<{ safes: string[] }>(
        `${apiNetwork["rinkeby"]}/owners/${address}/`
      );
      setSafes(res.data.safes);
      setLoadingSafes(false);
    } catch (error) {
      setLoadingSafes(false);
    }
  }, 500);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const address = event.target.value;
    setAddress(address);
    if (!address.length) {
      setSafes([]);
      setSelectedSafe(undefined);
      return;
    }
    getSafes(address);
  };

  const handleSafeClick = async (safe: string): Promise<void> => {
    setLoadingBalances(true);
    setSelectedSafe(safe);
    try {
      const res = await axios.get<BalanceInfo[]>(
        `${apiNetwork["rinkeby"]}/safes/${safe}/balances`
      );

      const filteredBalances = res.data.filter((b) => b.token !== null);
      setBalances(filteredBalances);
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
        <SafeItem key={b.token.name}>
          <div>
            <img src={b.token.logoUri} alt="Token logo" />
            {b.token.name}
          </div>
          <div>{new Big(b.balance).div(10 ** b.token.decimals).toFixed(4)}</div>
        </SafeItem>
      ) : null
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <TitleContainer>
        <StyledImage src={findMySafeImg} alt="findMySafeLogo" />
        <Title size="md"> Find my safe</Title>
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
                <SafeItem key={s} onClick={() => handleSafeClick(s)}>
                  <Text
                    size="md"
                    color={selectedSafe === s ? "primary" : "text"}
                    strong={selectedSafe === s}
                  >
                    {toShortAddress(s)}
                  </Text>
                  <FixedIcon type="chevronRight" />
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
