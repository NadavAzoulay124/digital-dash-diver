
export interface ABTest {
  id: string;
  testType: "campaign" | "ad_group" | "ad" | "budget";
  campaignName: string;
  variantA: string;
  variantB: string;
  startDate: string;
  status: "running" | "completed";
  results: {
    variantA: {
      impressions: number;
      clicks: number;
      conversions: number;
    };
    variantB: {
      impressions: number;
      clicks: number;
      conversions: number;
    };
  };
}

export interface FacebookCredentials {
  ad_account_id: string;
  access_token: string;
}

export interface Campaign {
  id?: string;
  name: string;
  objective?: string;
  status?: string;
  insights?: {
    data?: Array<{
      spend?: string;
      clicks?: string;
      impressions?: string;
      date_start?: string;
      date_stop?: string;
      website_purchase?: number;
      cpc?: string;
      frequency?: string;
      actions?: Array<{
        action_type: string;
        value: string;
      }>;
    }>;
  };
}
