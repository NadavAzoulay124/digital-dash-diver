
export interface GoogleAdsAccount {
  id: string;
  customer_id: string;
  client_id: string;
  developer_token: string;
  refresh_token: string;
  created_at?: string;
}

export interface GoogleAdsAccountFormData {
  customerId: string;
  developerToken: string;
}

export interface FormErrors {
  accountName?: string;
  developerToken?: string;
  customerId?: string;
  clientName?: string;
}

