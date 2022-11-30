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

// TODO: use this version 2 session (no all props are needed...
export const version2ActiveSession = {
  relay: {
    protocol: 'irn',
  },
  namespaces: {
    eip155: {
      accounts: ['eip155:5:0x57CB13cbef735FbDD65f5f2866638c546464E45F'],
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      events: ['accountsChanged', 'chainChanged'],
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
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {
        '5': 'https://rpc.goerli.mudit.blog',
      },
    },
  },
  controller: '61379db6ad2fd90e9e7f41662bc1fb3966f88cc00f208976de232a0020deb366',
  expiry: 1669911641,
  topic: 'df532a8ceede6fa863c486017ac535e744af9468ff6ce31c87bac5d34825204a',
  acknowledged: true,
  self: {
    publicKey: '61379db8ad2fd90e9e7f40662bc1fb3976f88cc00f208976de132a0020deb376',
    metadata: {
      name: 'Safe Wallet',
      description: 'The most trusted platform to manage digital assets on Ethereum',
      url: 'https://app.safe.global',
      icons: [
        'https://app.safe.global/favicons/mstile-150x150.png',
        'https://app.safe.global/favicons/logo_120x120.png',
      ],
    },
    peer: {
      publicKey: '9e6e8fc22cd7e3c63101c1033e1edfca6fb02918c868246b2a42370bded2146b',
      metadata: {
        description: '',
        url: 'https://test-wc-v2-dapp',
        icons: [],
        name: '',
      },
    },
  },
}
