
export interface SavedCredential {
  id: string;
  ad_account_id: string;
  account_name: string;
  client_name: string | null;
  created_at: string;
  access_token: string; // Added this field to match the database schema
  user_id: string; // Added this field to match the database schema
}

export interface FormErrors {
  accountName?: string;
  adAccountId?: string;
  accessToken?: string;
  clientName?: string;
}
