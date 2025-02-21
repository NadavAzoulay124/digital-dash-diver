
export interface SavedCredential {
  id: string;
  ad_account_id: string;
  account_name: string;
  created_at: string;
}

export interface FormErrors {
  accountName?: string;
  adAccountId?: string;
  accessToken?: string;
}
