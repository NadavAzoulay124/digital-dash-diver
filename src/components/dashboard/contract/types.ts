
export interface Service {
  id: string;
  name: string;
  price: string;
  selected: boolean;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  services: Service[];
  preview: string;
}

export type ContractStatus = 'draft' | 'pending' | 'signed' | 'expired';

export interface Contract {
  id: string;
  client_company: string;
  template_id: string;
  company_logo: string | null;
  status: ContractStatus;
  total_value: number;
  created_at: string;
  updated_at: string;
  signature_data: string | null;
  manual_signature: boolean;
}

export interface ContractService {
  id: string;
  contract_id: string;
  service_id: string;
  service_name: string;
  price: number;
}
