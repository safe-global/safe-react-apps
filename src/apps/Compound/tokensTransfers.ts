import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

import { Networks } from "@gnosis.pm/safe-apps-sdk";

const subgraphUri: { [key in Networks]: string } = {
  rinkeby:
    "https://api.thegraph.com/subgraphs/name/protofire/token-registry-rinkeby",
  mainnet: "https://api.thegraph.com/subgraphs/name/protofire/token-registry"
};

async function getPaginatedTransferEvents(
  client: any,
  first: number,
  skip: number,
  safeAddress: string,
  tokenAddr: string,
  cTokenAddr: string
) {
  return client.query({
    query: gql`
      query TransferEvents(
        $first: Int!
        $skip: Int!
        $token: String!
        $addresses: [String!]!
      ) {
        transferEvents(
          first: $first
          skip: $skip
          where: {
            token: $token
            destination_in: $addresses
            sender_in: $addresses
          }
        ) {
          amount
          sender
          destination
        }
      }
    `,
    variables: {
      first: first,
      skip: skip,
      token: tokenAddr.toLocaleLowerCase(),
      addresses: [cTokenAddr, safeAddress]
    }
  });
}

export async function getTokenTransferEvents(
  network: Networks,
  safeAddress: string,
  tokenAddr: string,
  cTokenAddr: string
) {
  const client = new ApolloClient({
    uri: subgraphUri[network]
  });

  let ended = false;
  let first = 1000;
  let skip = 0;
  let transferEvents: any = [];

  while (!ended) {
    try {
      const res: any = await getPaginatedTransferEvents(
        client,
        first,
        skip,
        safeAddress,
        tokenAddr,
        cTokenAddr
      );
      skip += first;

      transferEvents = [...transferEvents, ...res.data.transferEvents];
      if (res.data.transferEvents.length < first) {
        ended = true;
      }
    } catch (error) {
      ended = true;
      throw error;
    }
  }

  return transferEvents;
}

export function parseTransferEvents(
  senderAddress: string,
  transferEvents: Array<any>
) {
  let deposits = 0;
  let withdrawals = 0;
  
  transferEvents.forEach(event => {
    const parsedAmount = Number(event.amount);
    if (!Number.isNaN(parsedAmount)) {
      event.sender.toLowerCase() === senderAddress.toLowerCase()
        ? (deposits += parsedAmount)
        : (withdrawals += parsedAmount);
    }
  });
  return {
    deposits,
    withdrawals
  };
}
