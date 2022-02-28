export interface ProposedTransaction {
  id: number | string;
  description: {
    to: string;
    value: string;
    hexEncodedData?: string;
    contractMethod?: ContractMethod;
    contractFieldsValues?: Record<string, string>;
    nativeCurrencySymbol?: string;
    networkPrefix?: string;
  };
  raw: { to: string; value: string; data: string };
}

export interface ContractInterface {
  methods: ContractMethod[];
}

export interface BatchTransactionFile {
  version: string;
  chainId: string;
  createdAt: number;
  meta: {
    txBuilderVersion: string;
    checksum: string;
    createdFromSafeAddress: string;
    createdFromOwnerAddress: string;
    name: string;
    description: string;
  };
  transactions: BatchTransaction[];
}

export interface BatchTransaction {
  to: string;
  value: string;
  data?: string;
  contractMethod?: ContractMethod;
  contractInputsValues?: { [key: string]: string };
}

export interface ContractMethod {
  inputs: ContractInput[];
  name: string;
  payable: boolean;
}

export interface ContractInput {
  internalType: string;
  name: string;
  type: string;
}
