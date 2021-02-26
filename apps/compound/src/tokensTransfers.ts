import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { Networks } from '@gnosis.pm/safe-apps-sdk';

export type TokenInteractionData = {
  amount: string;
  destination: string;
  sender?: string;
};

const RINKEBY = 'https://api.thegraph.com/subgraphs/name/protofire/token-registry-rinkeby';
const MAINNET = 'https://api.thegraph.com/subgraphs/name/protofire/token-registry';

const subgraphUri: { [key in 'MAINNET' | 'RINKEBY']: string } = {
  RINKEBY,
  MAINNET,
};

const TRANSFER_EVENTS = gql`
  query TransferEvents($first: Int!, $skip: Int!, $token: String!, $addresses: [String!]!) {
    transferEvents(
      first: $first
      skip: $skip
      where: { token: $token, destination_in: $addresses, sender_in: $addresses }
    ) {
      amount
      sender
      destination
    }
  }
`;

async function getTransferEvents(
  client: any,
  safeAddress: string,
  tokenAddr: string,
  cTokenAddr: string,
): Promise<Array<TokenInteractionData>> {
  let ended = false;
  let first = 100;
  let skip = 0;
  let transferEvents: Array<TokenInteractionData> = [];

  while (!ended) {
    try {
      const res = await client.query({
        query: TRANSFER_EVENTS,
        variables: {
          first: first,
          skip: skip,
          token: tokenAddr.toLocaleLowerCase(),
          addresses: [cTokenAddr, safeAddress],
        },
      });
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

const MINT_EVENTS = gql`
  query MintEvents($first: Int!, $skip: Int!, $token: String!, $safeAddress: String!) {
    mintEvents(first: $first, skip: $skip, where: { token: $token, destination: $safeAddress }) {
      amount
      destination
    }
  }
`;

async function getMintEvents(
  client: any,
  safeAddress: string,
  tokenAddr: string,
): Promise<Array<TokenInteractionData>> {
  let ended = false;
  let first = 100;
  let skip = 0;
  let mintEvents: Array<TokenInteractionData> = [];

  while (!ended) {
    try {
      const res = await client.query({
        query: MINT_EVENTS,
        variables: {
          first: first,
          skip: skip,
          token: tokenAddr.toLocaleLowerCase(),
          safeAddress: safeAddress,
        },
      });
      skip += first;

      mintEvents = [...mintEvents, ...res.data.mintEvents];
      if (res.data.mintEvents.length < first) {
        ended = true;
      }
    } catch (error) {
      ended = true;
      throw error;
    }
  }

  return mintEvents;
}

export async function getTokenInteractions(
  network: Networks,
  safeAddress: string,
  tokenAddr: string,
  cTokenAddr: string,
) {
  if (network !== 'RINKEBY' && network !== 'MAINNET') {
    return [];
  }

  const client = new ApolloClient({
    uri: subgraphUri[network],
  });

  const mintEventsRes = await getMintEvents(client, safeAddress, tokenAddr);
  const transferEventsRes = await getTransferEvents(client, safeAddress, tokenAddr, cTokenAddr);
  return [...mintEventsRes, ...transferEventsRes];
}

export function parseEvents(senderAddress: string, tokenEvents: Array<any>) {
  let deposits = 0;
  let withdrawals = 0;

  tokenEvents.forEach((event) => {
    const parsedAmount = Number(event.amount);
    if (!Number.isNaN(parsedAmount)) {
      event.sender && event.sender.toLowerCase() === senderAddress.toLowerCase()
        ? (deposits += parsedAmount)
        : (withdrawals += parsedAmount);
    }
  });
  return {
    deposits,
    withdrawals,
  };
}
