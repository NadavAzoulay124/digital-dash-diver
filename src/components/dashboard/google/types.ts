
export interface GoogleAdsCredential {
  id: string;
  user_id: string;
  account_name: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  developer_token: string;
  customer_id: string;
  client_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface FormErrors {
  accountName?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  developerToken?: string;
  customerId?: string;
  clientName?: string;
}
