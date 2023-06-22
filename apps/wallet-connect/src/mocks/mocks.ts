import { Verify } from '@walletconnect/types'

const verifyContext: Verify.Context = {
  verified: {
    verifyUrl: '',
    validation: 'VALID',
    origin: 'https://app.walletconnect.com',
  },
} as Verify.Context

export const mockSafeInfo = {
  safeAddress: '0x57CB13cbef735FbDD65f5f2866638c546464E45F',
  chainId: '5',
}

export const mockChainInfo = {
  chainId: '5',
  chainName: 'Goerli',
  shortName: 'gor',
  nativeCurrency: {
    decimals: 18,
    logoUri: 'https://safe-transaction-assets.safe.global/chains/5/currency_logo.png',
    name: 'Görli Ether',
    symbol: 'GOR',
  },
  blockExplorerUriTemplate: {
    address: 'https://goerli.etherscan.io/address/{{address}}',
    api: 'https://api-goerli.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    txHash: 'https://goerli.etherscan.io/tx/{{txHash}}',
  },
}

export const mockOriginUrl = {
  origin: 'https://localhost:3000',
}

export const mockSafeAppsListResponse = [
  {
    id: 11,
    chainIds: ['5'],
    description: 'Connect your Safe to any dApp that supports WalletConnect',
    iconUrl: 'http://localhost/wallet-connect/wallet-connect.svg',
    accessControl: { type: 'NO_RESTRICTIONS' },
    name: 'WalletConnect',
    provider: null,
    tags: ['dashboard-widgets', 'wallet-connect'],
    url: 'http://localhost/wallet-connect',
  },
]

export const mockSessionProposal = {
  id: 1111111111111111,
  params: {
    id: 1111111111111111,
    pairingTopic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    expiry: 1669889398,
    requiredNamespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        chains: ['eip155:5'],
        events: [],
      },
    },
    optionalNamespaces: {},
    relays: [
      {
        protocol: 'irn',
      },
    ],
    proposer: {
      publicKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      metadata: {
        description: '',
        url: 'https://test-dapp.com',
        icons: [],
        name: 'Test v2 Dapp name',
      },
    },
  },
  verifyContext,
}

export const mockV2SessionObj = {
  topic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  peer: {
    metadata: {
      description: '',
      url: 'https://test-dapp.com',
      icons: [],
      name: 'Test v2 Dapp name',
    },
  },
}

export const mockInvalidEVMSessionProposal = {
  id: 1111111111111111,
  params: {
    id: 1111111111111111,
    pairingTopic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    expiry: 1669998834,
    requiredNamespaces: {
      cosmos: {
        methods: ['cosmos_signDirect', 'cosmos_signAmino'],
        chains: ['cosmos:cosmoshub-4'],
        events: [],
      },
    },
    optionalNamespaces: {},
    relays: [
      {
        protocol: 'irn',
      },
    ],
    proposer: {
      publicKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      metadata: {
        description: '',
        url: 'https://test-dapp.com',
        icons: [],
        name: 'Test v2 Dapp name',
      },
    },
  },
  verifyContext,
}

export const mockInvalidChainIdSessionProposal = {
  id: 1111111111111111,
  params: {
    id: 1111111111111111,
    pairingTopic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    expiry: 1669889398,
    requiredNamespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        chains: ['eip155:1'], // only an invalid chainId is present
        events: [],
      },
    },
    optionalNamespaces: {},
    relays: [
      {
        protocol: 'irn',
      },
    ],
    proposer: {
      publicKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      metadata: {
        description: '',
        url: 'https://test-dapp.com',
        icons: [],
        name: 'Test v2 Dapp name',
      },
    },
  },
  verifyContext,
}

// v2 transaction request mock

export const mockTransactionRequest = {
  id: 1111111111111111,
  topic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  params: {
    request: {
      method: 'personal_sign',
      params: ['0x1111111111111', '0x57CB13cbef735FbDD65f5f2866638c546464E45F'],
    },
    chainId: 'eip155:5',
  },
}

export const mockValidTransactionRequest = {
  id: 1111111111111111,
  topic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  params: {
    request: {
      method: 'personal_sign',
      params: ['0x1111111111111', '0x57CB13cbef735FbDD65f5f2866638c546464E45F'],
    },
    chainId: 'eip155:5',
  },
  verifyContext,
}

export const mockInvalidChainTransactionRequest = {
  id: 1111111111111111,
  topic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  params: {
    request: {
      method: 'personal_sign',
      params: ['0x1111111111111', '0x57CB13cbef735FbDD65f5f2866638c546464E45F'],
    },
    chainId: 'eip155:420',
  },
  verifyContext,
}

// active v2 sessions

export const mockActiveSessions = {
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: {
    relay: {
      protocol: 'irn',
    },
    namespaces: {
      eip155: {
        accounts: ['eip155:5:0x57CB13cbef735FbDD65f5f2866638c546464E45F'],
        methods: ['eth_sendTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        events: [],
      },
    },
    requiredNamespaces: {
      eip155: {
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
        ],
        chains: ['eip155:5'],
        events: [],
        rpcMap: {
          '5': 'https://rpc.goerli.test',
        },
      },
    },
    controller: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    expiry: 1669911641,
    topic: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    acknowledged: true,
    self: {
      publicKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      metadata: {
        name: 'Safe Wallet',
        description: 'The most trusted platform to manage digital assets on Ethereum',
        url: 'http://localhost:3000',
        icons: [],
      },
    },
    peer: {
      publicKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      metadata: {
        description: '',
        url: 'https://test-dapp.com',
        icons: [],
        name: 'Test v2 Dapp name',
      },
    },
  },
}
