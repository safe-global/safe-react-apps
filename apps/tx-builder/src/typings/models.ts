import { ContractMethod } from '../hooks/useServices/interfaceRepository';

export interface ProposedTransaction {
  id: number | string;
  description: {
    to: string;
    value: string;
    hexEncodedData: string;
    contractMethod: ContractMethod | undefined;
    contractFieldsValues: Record<string, string>;
  };
  raw: { to: string; value: string; data: string };
}
