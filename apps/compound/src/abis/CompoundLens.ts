const CompoundLensABI = [
  {
    constant: false,
    inputs: [
      { internalType: 'contract Comp', name: 'comp', type: 'address' },
      { internalType: 'contract ComptrollerLensInterface', name: 'comptroller', type: 'address' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'getCompBalanceMetadataExt',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
          { internalType: 'uint256', name: 'votes', type: 'uint256' },
          { internalType: 'address', name: 'delegate', type: 'address' },
          { internalType: 'uint256', name: 'allocated', type: 'uint256' },
        ],
        internalType: 'struct CompoundLens.CompBalanceMetadataExt',
        name: '',
        type: 'tuple',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default CompoundLensABI;
