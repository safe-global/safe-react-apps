import { ContractMethod, ContractInterface } from '../hooks/useServices/interfaceRepository';

export interface ProposedTransaction {
  id: number;
  contractInterface: ContractInterface | null;
  description: {
    to: string;
    value: string;
    customTransactionData: string;
    contractMethod?: ContractMethod;
    contractFieldsValues: Record<string, string>;
    contractMethodIndex?: string;
  };
  raw: { to: string; value: string; data: string };
}
