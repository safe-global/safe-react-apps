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

export interface BatchFile {
  version: string;
  chainId: string;
  createdAt: number;
  meta: BatchFileMeta;
  transactions: BatchTransaction[];
}

export interface BatchFileMeta {
  txBuilderVersion?: string;
  checksum?: string;
  createdFromSafeAddress?: string;
  createdFromOwnerAddress?: string;
  name: string;
  description?: string;
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
