import React from "react";
import Big from "big.js";
import styled from "styled-components";

import { Text, Loader } from "@gnosis.pm/safe-react-components";

import { setImageToPlaceholder } from "../utils";
import { BalanceInfo } from "../api";

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

const BalancesContainer = styled.div`
  height: 310px;
  width: 400px;
  overflow-y: auto;
`;

const BalanceItem = styled.div`
  padding: 3px 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  selectedSafe: string | undefined;
  loadingBalances: boolean;
  balances: BalanceInfo[] | undefined;
};

const Balances = ({ selectedSafe, loadingBalances, balances }: Props) => {
  if (!selectedSafe) {
    return null;
  }

  if (loadingBalances) {
    return (
      <BalancesContainer>
        <Loader size="md" />
      </BalancesContainer>
    );
  }

  if (!balances?.length) {
    return (
      <BalancesContainer>
        <NoBalanceFound>
          <Text size="lg" strong>
            Not balances found
          </Text>
        </NoBalanceFound>
      </BalancesContainer>
    );
  }

  return (
    <BalancesContainer>
      {balances?.map((b) =>
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
            <div>
              {new Big(b.balance).div(10 ** b.token.decimals).toFixed(4)}
            </div>
          </BalanceItem>
        ) : null
      )}
    </BalancesContainer>
  );
};

export default Balances;
