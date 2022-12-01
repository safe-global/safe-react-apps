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
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
        ],
        chains: ['eip155:5'],
        events: ['chainChanged', 'accountsChanged'],
      },
    },
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
