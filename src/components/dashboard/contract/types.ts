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